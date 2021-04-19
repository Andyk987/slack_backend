import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthGuard } from 'src/auth/auth.guard';
import { CREATE_CHANNEL, LEAVE_CHANNEL } from './chat.constants';
import { ChatService } from './chat.service';
import { CreateChannelInput } from './dtos/create-channel.dto';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) { }

  private readonly logger = new Logger('ChatGateway');

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log(`Socket Server Init Complete`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected: ${client.id}`);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage(CREATE_CHANNEL)
  async createChannel(
    @MessageBody() data: CreateChannelInput,
    @ConnectedSocket() client: Socket,
  ): Promise<any> {
    const newChannel = this.chatService.createChannel(data);
    if (!newChannel) {
      client.emit(CREATE_CHANNEL, "Sorry you can't create a channel");
      return false;
    }
    return true;
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage(LEAVE_CHANNEL)
  async leave_channel(

  ) { }

  @SubscribeMessage('chat')
  handleChat(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    console.log(data);
    return { event: 'chat', data };
  }
}
