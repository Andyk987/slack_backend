import { Injectable } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CommonService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async getUserByToken(token: string): Promise<User | boolean> {
    const decoded = await this.jwtService.verify(token.toString());
    if (typeof decoded !== 'object' && !decoded.hasOwnProperty('id'))
      return false;
    const { user } = await this.usersService.findById(decoded['id']);
    return user ? user : false;
  }
}
