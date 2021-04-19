import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Workplace } from './entities/workplace.entity';
import { Channel } from './entities/channel.entity';
import { ChatResolver } from './chat.resolver';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workplace, Channel]),
    UsersModule
  ],
  providers: [ChatGateway, ChatService, ChatResolver],
})
export class ChatModule { }
