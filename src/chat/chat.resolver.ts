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
  CreateWorkspaceInput,
  CreateWorkSpaceOutput,
} from './dtos/create-workspace.dto';
import { Workspace } from './entities/workspace.entity';

@Resolver(() => Workspace)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Query(() => [Workspace])
  async allWorkplace() {
    return this.chatService.allWorkspace();
  }

  @UseGuards(AuthGuard)
  @Mutation(() => CreateWorkSpaceOutput)
  async createWorkspace(
    @AuthUser() authUser: User,
    @Args('input') createWorkspace: CreateWorkspaceInput,
  ) {
    return this.chatService.createWorkspace(authUser, createWorkspace);
  }

  @Mutation(() => CreateChannelOutput)
  async createChannel(
    @Args('input') createChannelInput: CreateChannelInput,
  ): Promise<CreateChannelOutput> {
    return this.chatService.createChannel(createChannelInput);
  }
}
