import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/users/entities/user.entity';
import { ChatService } from './chat.service';
import {
  CreateChannelInput,
  CreateChannelOutput,
} from './dtos/create-channel.dto';
import {
  CreateWorkplaceInput,
  CreateWorkplaceOutput,
} from './dtos/create-workplace.dto';
import { Workplace } from './entities/workplace.entity';

@Resolver(() => Workplace)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Query(() => [Workplace])
  async allWorkplace() {
    return this.chatService.allWorkplace();
  }

  @UseGuards(AuthGuard)
  @Mutation(() => CreateWorkplaceOutput)
  async createWorkplace(
    @AuthUser() authUser: User,
    @Args('input') createWorkplaceInput: CreateWorkplaceInput,
  ) {
    return this.chatService.createWorkplace(authUser, createWorkplaceInput);
  }

  @Mutation(() => CreateChannelOutput)
  async createChannel(
    @Args('input') createChannelInput: CreateChannelInput,
  ): Promise<CreateChannelOutput> {
    return this.chatService.createChannel(createChannelInput);
  }
}
