import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import type { StringValue } from 'ms';
import { UserService } from '../../user/services/user.service';
import { UsersAuth } from '../../user/entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    const existing = await this.userService.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException({
        success: false,
        message: 'Email already in use',
      });
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const savedAccount = await this.userService.create(dto.email, passwordHash);

    const tokens = await this.issueAndPersistTokens(savedAccount);

    return {
      success: true,
      data: {
        user: this.toUserResponse(savedAccount),
        ...tokens,
      },
    };
  }

  async login(dto: LoginDto) {
    const account = await this.userService.findByEmail(dto.email);

    if (!account || account.status !== 'active') {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      account.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const tokens = await this.issueAndPersistTokens(account);

    return {
      success: true,
      data: {
        user: this.toUserResponse(account),
        ...tokens,
      },
    };
  }

  async refresh(refreshToken: string) {
    const currentRefreshToken = await this.refreshTokenRepository.findOne({
      where: {
        refreshToken,
        status: 'active',
      },
    });

    if (!currentRefreshToken) {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    const account = await this.userService.findById(currentRefreshToken.userId);

    if (!account || account.status !== 'active') {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    const tokens = await this.issueAndPersistTokens(account);

    return {
      success: true,
      data: {
        user: this.toUserResponse(account),
        ...tokens,
      },
    };
  }

  async logout(refreshToken: string) {
    const refreshTokenRecord = await this.refreshTokenRepository.findOne({
      where: {
        refreshToken,
        status: 'active',
      },
    });

    if (refreshTokenRecord) {
      refreshTokenRecord.status = 'revoked';
      await this.refreshTokenRepository.save(refreshTokenRecord);
    }

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  async getMe(userId: number) {
    const account = await this.userService.findById(userId);

    if (!account) {
      throw new UnauthorizedException({
        success: false,
        message: 'User not found',
      });
    }

    return {
      success: true,
      data: this.toUserResponse(account),
    };
  }

  private async issueAndPersistTokens(account: UsersAuth): Promise<TokenPair> {

    await this.refreshTokenRepository.update(
      { userId: account.id, status: 'active' },
      { status: 'revoked' },
    );

    const tokens = await this.generateTokens(account);

    const refreshTokenEntity = this.refreshTokenRepository.create({
      userId: account.id,
      refreshToken: tokens.refreshToken,
      status: 'active',
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return tokens;
  }

  private async generateTokens(account: UsersAuth): Promise<TokenPair> {
    const payload = {
      sub: account.id,
      email: account.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'access-secret-dev',
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as StringValue,
    });

    const refreshToken = crypto.randomBytes(256).toString('hex');

    return { accessToken, refreshToken };
  }

  private toUserResponse(account: UsersAuth) {
    return {
      id: account.id,
      email: account.email,
      status: account.status,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }
}
