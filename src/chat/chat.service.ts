import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, getRepository, Repository } from 'typeorm';
import { Workspace } from './entities/workspace.entity';
import { Channel } from './entities/channel.entity';
import {
  CreateWorkspaceInput,
  CreateWorkSpaceOutput,
} from './dtos/create-workspace.dto';
import {
  CreateChannelInput,
  CreateChannelOutput,
} from './dtos/create-channel.dto';
import { User } from 'src/users/entities/user.entity';
import { JoinChannelInput, JoinChannelOutput } from './dtos/join-channel.dto';
import { LeaveChannelOutput } from './dtos/leave-channel.dto';
import {
  GetCurrentWorkspaceInput,
  GetCurrentWorkspaceOutput,
} from './dtos/get-current-workspace.dto';
import {
  ChatWithOptions,
  GetChannelInput,
  GetChannelOutput,
} from './dtos/get-channel.dto';
import { Chat } from './entities/chat.entity';
import { SaveChatInput, SaveChatOutput } from './dtos/save-chat.dto';
import {
  JoinWorkspaceInput,
  JoinWorkspaceOutput,
} from './dtos/join-workspace.dto';
import { LoadChatsInput, LoadChatsOutput } from './dtos/load-chats.dto';
import { checkIsLastChatOfDays } from './util/checkIsLastChatOfDays';
import * as _ from 'lodash';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaces: Repository<Workspace>,
    @InjectRepository(Channel)
    private readonly channels: Repository<Channel>,
    @InjectRepository(Chat)
    private readonly chats: Repository<Chat>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async saveChat(user: User, chatData: SaveChatInput): Promise<SaveChatOutput> {
    try {
      const channel = await this.channels.findOne(chatData.channelId);
      if (!channel) return { ok: false, error: 'no channel found' };

      const manager = await getManager();
      const timeStamp = await manager.query(`select current_timestamp`);
      const date = new Date(timeStamp[0].current_timestamp);

      await this.chats.save(
        this.chats.create({
          context: chatData.context,
          channel,
          user,
        }),
      );
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: "can't save chat",
      };
    }
  }

  async getCurrentWorkspace({
    id,
  }: GetCurrentWorkspaceInput): Promise<GetCurrentWorkspaceOutput> {
    try {
      const currentWorkspace = await this.workspaces.findOne(
        { id },
        {
          relations: ['channels'],
        },
      );
      if (!currentWorkspace)
        return { ok: false, error: "Can't find workspace" };
      return {
        ok: true,
        workspace: currentWorkspace,
      };
    } catch (e) {
      return {
        ok: false,
        error: "You can't get current workspace",
      };
    }
  }

  async createWorkspace(
    creator: User,
    { title, avatarUrl }: CreateWorkspaceInput,
  ): Promise<CreateWorkSpaceOutput> {
    try {
      const isWorkSpaceExist = await this.workspaces.findOne({ title });
      if (isWorkSpaceExist) {
        return {
          ok: false,
          error: 'This name is already in use',
        };
      }
      const newWorkspace = this.workspaces.create({
        title,
        avatarUrl,
        creator,
      });
      await this.workspaces.save(newWorkspace);
      return {
        ok: true,
        newWorkspace,
      };
    } catch (e) {
      return {
        ok: false,
        error: "You can't create a workspace",
      };
    }
  }

  async joinWorkspace(
    user: User,
    { id }: JoinWorkspaceInput,
  ): Promise<JoinWorkspaceOutput> {
    try {
      const workspace = await this.workspaces.findOne(id, {
        relations: ['members'],
      });
      if (!workspace) return { ok: false, error: 'no workspace exist' };

      if (user.joined_workspaces.some((workspace) => workspace.id === id))
        return { ok: false, error: 'you have already joined' };
      workspace.members = [...workspace.members, user];
      await this.workspaces.save(workspace);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: "you can't join workspace",
      };
    }
  }

  async createChannel(
    creator: User,
    { title, info, workspaceId }: CreateChannelInput,
  ): Promise<CreateChannelOutput> {
    try {
      const workspace = await this.workspaces.findOne(workspaceId);
      if (!workspace) {
        return {
          ok: false,
          error: "You're not belong to workspace currently",
        };
      }
      const titleFormat = title.trim().replace(/ /g, '_');
      const isChannelExist = await this.channels.findOne({
        title: titleFormat,
      });
      if (isChannelExist) {
        return {
          ok: false,
          error: 'This name is already in use',
        };
      }
      const newChannel = await this.channels.save(
        this.channels.create({
          title: titleFormat,
          info,
          workspace,
          creator,
        }),
      );
      return {
        ok: true,
        newChannel,
      };
    } catch (error) {
      return {
        ok: false,
        error: "You can't create a channel",
      };
    }
  }

  async joinChannel(
    user: User,
    { id }: JoinChannelInput,
  ): Promise<JoinChannelOutput> {
    try {
      const channel = await this.channels.findOne(id, {
        relations: ['members'],
      });
      if (!channel) return { ok: false, error: 'no channel exist' };
      if (user.joined_channels.some((channel) => channel.id === id))
        return { ok: false, error: 'you have already joined' };
      channel.members = [...channel.members, user];
      await this.channels.save(channel);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: "You can't join channel",
      };
    }
  }

  async leaveChannel(
    currentUserId: number,
    joinedChannelId: number,
  ): Promise<LeaveChannelOutput> {
    try {
      const currentUser = await this.users.findOne(currentUserId, {
        relations: ['joined_channels'],
      });
      const joinedChannel = await this.channels.findOne(joinedChannelId, {
        relations: ['members'],
      });
      if (!joinedChannel) return { ok: false, error: 'no channel exist' };
      currentUser.joined_channels = currentUser.joined_channels.filter(
        (channel) => +channel.id !== joinedChannelId,
      );
      await this.users.save(currentUser);
      return {
        ok: true,
        joinedChannel,
      };
    } catch {
      return {
        ok: false,
        error: "you can't leave channel",
      };
    }
  }

  async getChannelById(
    user: User,
    { id, workspaceId, limit = 20 }: GetChannelInput,
  ): Promise<GetChannelOutput> {
    try {
      const channel = await getRepository(Channel)
        .createQueryBuilder('channel')
        .select([
          'channel.id',
          'channel.createAt',
          'channel.title',
          'channel.info',
        ])
        .leftJoinAndSelect('channel.chats', 'chat')
        .leftJoinAndSelect('chat.user', 'user')
        .limit(limit)
        .orderBy('chat.timeStamp', 'DESC')
        .where('channel.id = :id', { id })
        .getOne();
      if (!channel) return { ok: false, error: 'no channel' };

      const manager = getManager();
      const [{ totalCounts }] = await manager.query(
        `SELECT COUNT(*) as "totalCounts" FROM "chat" "chat" WHERE "chat"."channelId" = '${id}'`,
      );

      const getChannel: any = _.cloneDeep(channel);
      const chatWithOptions: ChatWithOptions[] = checkIsLastChatOfDays(
        getChannel.chats,
      );
      getChannel.chats = chatWithOptions;
      getChannel.totalCounts = totalCounts;

      const joinedChannels: Channel[] = user.joined_channels.filter(
        (channel: any) => channel.workspaceId === workspaceId,
      );

      const joined: boolean = joinedChannels.some(
        (channel: any) => channel.id === id,
      );

      return {
        ok: true,
        getChannel,
        joined,
      };
    } catch (e) {
      return {
        ok: false,
        error: "you can't get channel",
      };
    }
  }

  async loadChats({
    id,
    skipNumber,
  }: LoadChatsInput): Promise<LoadChatsOutput> {
    try {
      const [chats, totalChats] = await this.chats.findAndCount({
        where: {
          channel: {
            id,
          },
        },
        take: 11,
        skip: skipNumber,
        order: {
          createAt: 'DESC',
        },
        relations: ['user'],
      });

      const getChats = _.cloneDeep(chats);
      const loadChats: ChatWithOptions[] = checkIsLastChatOfDays(getChats);

      const splitId = id.split('-')[4];

      return {
        ok: true,
        loadChats,
        totalChats,
        splitId,
      };
    } catch (e) {
      return {
        ok: false,
        error: "you can't load chats",
      };
    }
  }
}
