import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Workspace } from './entities/workspace.entity';
import { Channel } from './entities/channel.entity';
import { ChatResolver } from './chat.resolver';
import { User } from 'src/users/entities/user.entity';
import { Chat } from './entities/chat.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Workspace, Channel, User, Chat])],
  providers: [ChatGateway, ChatService, ChatResolver],
})
export class ChatModule {}
