import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Follow } from './entities/follow.entity';
import { HashPasswordRepository } from './repositories/hash-password.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow, HashPasswordRepository])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
