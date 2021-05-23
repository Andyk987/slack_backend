import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workplace } from './entities/workplace.entity';
import { Channel } from './entities/channel.entity';
import {
  CreateWorkplaceInput,
  CreateWorkplaceOutput,
} from './dtos/create-workplace.dto';
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
    @InjectRepository(Workplace)
    private readonly workplaces: Repository<Workplace>,
    @InjectRepository(Channel)
    private readonly channels: Repository<Channel>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async allWorkplace() {
    const workplace = await this.workplaces.find();
    return workplace;
  }

  async createWorkplace(
    creator: User,
    { title, avatarUrl }: CreateWorkplaceInput,
  ): Promise<CreateWorkplaceOutput> {
    try {
      const isWorkplaceExist = await this.workplaces.findOne({ title });
      if (isWorkplaceExist) {
        return {
          ok: false,
          error: 'This name is already in use',
        };
      }
      const newWorkplace = this.workplaces.create({
        title,
        avatarUrl,
        creator,
      });
      await this.workplaces.save(newWorkplace);
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
    workplaceId,
  }: CreateChannelInput): Promise<CreateChannelOutput> {
    try {
      const workplace = await this.workplaces.findOne(workplaceId);
      if (!workplace) {
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
          workplace,
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
