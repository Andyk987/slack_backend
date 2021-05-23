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
import { CREATE_CHANNEL, JOIN_CHANNEL, LEAVE_CHANNEL } from './chat.constants';
import { ChatService } from './chat.service';
import {
  CreateChannelInput,
  CreateChannelOutput,
} from './dtos/create-channel.dto';
import { JoinChannleInput, JoinChannleOutput } from './dtos/join-channel.dto';
import { LeaveChannelOutput } from './dtos/leave-channel.dto';

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

  @SubscribeMessage(CREATE_CHANNEL)
  async createChannel(
    @MessageBody() data: CreateChannelInput,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<CreateChannelOutput> | boolean> {
    const token = client.handshake.auth.token;
    const user = token ? await this.commonService.getUserByToken(token) : false;
    if (!user) return false;
    const { ok, error, newChannel } = await this.chatService.createChannel(
      data,
    );
    if (ok) {
      client.join(newChannel.title);
      client.to(newChannel.title).emit(JOIN_CHANNEL, `${user['name']} joined`);
    }
    return {
      event: CREATE_CHANNEL,
      data: { ok, error },
    };
  }

  @SubscribeMessage(JOIN_CHANNEL)
  async joinChannel(
    @MessageBody() data: JoinChannleInput,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<JoinChannleOutput> | boolean> {
    const token = client.handshake.auth.token;
    const user = token ? await this.commonService.getUserByToken(token) : false;
    if (!user) return false;
    const { ok, error, newJoinChannel } = await this.chatService.joinChannel(
      user['id'],
      data.channelId,
    );
    if (ok) {
      client.join(newJoinChannel.title);
      client
        .to(newJoinChannel.title)
        .emit(JOIN_CHANNEL, `${user['name']} joined`);
    }
    return {
      event: JOIN_CHANNEL,
      data: { ok, error },
    };
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

  @SubscribeMessage('chat')
  handleChat(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    console.log(data);
    return { event: 'chat', data };
  }
}
