import { Logger } from '@nestjs/common';
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
import { CommonService } from 'src/common/common.service';
import { CHAT, JOIN_CHANNEL, LEAVE_CHANNEL, SAVE_CHAT } from './chat.constants';
import { ChatService } from './chat.service';
import { JoinChannelInput } from './dtos/join-channel.dto';
import { LeaveChannelOutput } from './dtos/leave-channel.dto';
import { SaveChatOutput } from './dtos/save-chat.dto';

@WebSocketGateway(4001, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly commonService: CommonService,
  ) {}

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

  @SubscribeMessage(SAVE_CHAT)
  async saveChat(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<SaveChatOutput>> {
    client.broadcast.emit('chat', data);
    const token = client.handshake.auth.token;
    const { ok, error, user } = token
      ? await this.commonService.getUserByToken(token)
      : null;
    if (!user) return { event: SAVE_CHAT, data: { ok, error } };
    const chatData = {
      context: data.context,
      timeStamp: data.timeStamp,
      channelId: client.handshake.auth.channelId,
    };
    const saveChat = await this.chatService.saveChat(user, chatData);
    return {
      event: SAVE_CHAT,
      data: {
        ok: saveChat.ok,
        error: saveChat.error,
      },
    };
  }

  @SubscribeMessage(JOIN_CHANNEL)
  joinChannel(
    @MessageBody() data: JoinChannelInput,
    @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    console.log(data);
    return { event: 'join', data: 'few' };
  }

  @SubscribeMessage(LEAVE_CHANNEL)
  async leave_channel(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<LeaveChannelOutput>> {
    const token = client.handshake.auth.token;
    const user = token ? await this.commonService.getUserByToken(token) : false;
    const { ok, error, joinedChannel } = await this.chatService.leaveChannel(
      user['id'],
      data.channelId,
    );
    if (ok) {
      client.leave(joinedChannel.title);
      client.broadcast.emit(LEAVE_CHANNEL, `${user['name']} leaved`);
    }
    return { event: LEAVE_CHANNEL, data: { ok, error } };
  }

  @SubscribeMessage(CHAT)
  async chat(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    socket.broadcast.emit(CHAT, data);
    return;
  }
}
