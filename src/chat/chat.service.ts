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

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Workplace)
    private readonly workplace: Repository<Workplace>,
    @InjectRepository(Channel)
    private readonly channel: Repository<Channel>,
  ) {}

  async allWorkplace() {
    const workplace = await this.workplace.find();
    console.log(workplace);
    return workplace;
  }

  async createWorkplace({
    title,
    avatarUrl,
  }: CreateWorkplaceInput): Promise<CreateWorkplaceOutput> {
    try {
      const isWorkplaceExist = await this.workplace.findOne({ title });
      if (isWorkplaceExist) {
        return {
          ok: false,
          error: 'This name is already in use',
        };
      }
      await this.workplace.save(
        this.workplace.create({
          title,
          avatarUrl,
        }),
      );
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
      const workplace = await this.workplace.findOne(workplaceId);
      if(!workplace) {
        return {
          ok: false,
          error: "You're not belong to workplace currently",
        }
      }
      const nonSpecialChars = /^(?=[^_])([\w가-힣 ])([\w가-힣 ]?)*(?=[\w가-힣])([^_])$/g;
      if (!nonSpecialChars.test(title)) {
        return {
          ok: false,
          error: 'Please rename title again',
        };
      }
      const channelTitle = title.trim().replace(/ /g, '_');
      const isChannelExist = await this.channel.findOne({
        title: channelTitle,
      });
      if (isChannelExist) {
        return {
          ok: false,
          error: 'This name is already in use',
        };
      }
      await this.channel.save(
        this.channel.create({
          title: channelTitle,
          info,
          workplace
        }),
      );
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: "You can't create a channel",
      };
    }
  }
}
