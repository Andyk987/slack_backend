import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
import { JoinChannleOutput } from './dtos/join-channel.dto';
import { LeaveChannelOutput } from './dtos/leave-channel.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaces: Repository<Workspace>,
    @InjectRepository(Channel)
    private readonly channels: Repository<Channel>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async allWorkspace() {
    const workplace = await this.workspaces.find();
    return workplace;
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
      };
    } catch (e) {
      return {
        ok: false,
        error: "You can't create a workplace",
      };
    }
  }

  async createChannel({
    title,
    info,
    workspaceId,
  }: CreateChannelInput): Promise<CreateChannelOutput> {
    try {
      const workspace = await this.workspaces.findOne(workspaceId);
      if (!workspace) {
        return {
          ok: false,
          error: "You're not belong to workplace currently",
        };
      }
      // const nonSpecialChars = /^(?=[^_])([\w가-힣 ])([\w가-힣 ]?)*(?=[\w가-힣])([^_])$/g; //should have to refactoring
      // if (!nonSpecialChars.test(title)) {
      //   return {
      //     ok: false,
      //     error: 'Please rename title again',
      //   };
      // }
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
    currentUserId: number,
    newJoinChannelId: number,
  ): Promise<JoinChannleOutput> {
    try {
      const currentUser = await this.users.findOne(currentUserId, {
        relations: ['joined_channels'],
      });
      const channel = await this.channels.findOne(newJoinChannelId, {
        relations: ['members'],
      });
      if (!channel) return { ok: false, error: 'no channel exist' };
      if (
        currentUser.joined_channels.some(
          (channel) => channel.id === newJoinChannelId,
        )
      )
        return { ok: false, error: 'you have already joined' };
      channel.members = [...channel.members, currentUser];
      const newJoinChannel = await this.channels.save(channel);
      return {
        ok: true,
        newJoinChannel,
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
        (channel) => channel.id !== joinedChannelId,
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
}
