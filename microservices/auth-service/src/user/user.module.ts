import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersAuth } from './entities/user.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersAuth])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
