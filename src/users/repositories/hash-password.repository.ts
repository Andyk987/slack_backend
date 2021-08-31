import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class HashPasswordRepository extends Repository<User> {
  async hashPassword(password: string, saltRounds: number) {
    if (password && password !== null) {
      try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }
  }

  async compareHashPassword(password: string, hash: string) {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }
}
