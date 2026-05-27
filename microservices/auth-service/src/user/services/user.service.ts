import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersAuth } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersAuth)
    private readonly usersAuthRepository: Repository<UsersAuth>,
  ) {}

  async findByEmail(email: string): Promise<UsersAuth | null> {
    return this.usersAuthRepository.findOne({
      where: { email: email.toLowerCase().trim() },
    });
  }

  async findById(id: number): Promise<UsersAuth | null> {
    return this.usersAuthRepository.findOne({
      where: { id },
    });
  }

  async create(email: string, passwordHash: string): Promise<UsersAuth> {
    const account = this.usersAuthRepository.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      status: 'active',
    });
    return this.usersAuthRepository.save(account);
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await this.usersAuthRepository.update(id, { status });
  }
}
