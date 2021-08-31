import { Injectable } from '@nestjs/common';
import { GetChannelOutput } from 'src/chat/dtos/get-channel.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { GetUserByTokenOutput } from './dtos/get-user.dto';

@Injectable()
export class CommonService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async getUserByToken(token: string): Promise<GetUserByTokenOutput> {
    const decoded = await this.jwtService.verify(token);
    if (typeof decoded !== 'object' && !decoded.hasOwnProperty('id'))
      return { ok: false };
    const { user } = await this.usersService.findById(decoded['id']);
    if (!user) return { ok: false };
    return { ok: true, user };
  }
}
