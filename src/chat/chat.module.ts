import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Workplace } from './entities/workplace.entity';
import { Channel } from './entities/channel.entity';
import { ChatResolver } from './chat.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Workplace, Channel])],
  providers: [ChatGateway, ChatService, ChatResolver],
})
export class ChatModule {}
