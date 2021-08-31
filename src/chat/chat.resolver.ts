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
import { GetChannelInput, GetChannelOutput } from './dtos/get-channel.dto';
import {
  GetCurrentWorkspaceInput,
  GetCurrentWorkspaceOutput,
} from './dtos/get-current-workspace.dto';
import { JoinChannelInput, JoinChannelOutput } from './dtos/join-channel.dto';
import {
  JoinWorkspaceInput,
  JoinWorkspaceOutput,
} from './dtos/join-workspace.dto';
import { LoadChatsInput, LoadChatsOutput } from './dtos/load-chats.dto';
import { Workspace } from './entities/workspace.entity';

@Resolver(() => Workspace)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Query(() => GetCurrentWorkspaceOutput)
  async getCurrentWorkspace(
    @Args('input') getCurrentWorkspaceInput: GetCurrentWorkspaceInput,
  ): Promise<GetCurrentWorkspaceOutput> {
    return this.chatService.getCurrentWorkspace(getCurrentWorkspaceInput);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => CreateWorkSpaceOutput)
  async createWorkspace(
    @AuthUser() authUser: User,
    @Args('input') createWorkspace: CreateWorkspaceInput,
  ) {
    return this.chatService.createWorkspace(authUser, createWorkspace);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => JoinWorkspaceOutput)
  async joinWorkspace(
    @AuthUser() user: User,
    @Args('input') joinWorkspaceInput: JoinWorkspaceInput,
  ): Promise<JoinWorkspaceOutput> {
    return this.chatService.joinWorkspace(user, joinWorkspaceInput);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => CreateChannelOutput)
  async createChannel(
    @AuthUser() creator: User,
    @Args('input') createChannelInput: CreateChannelInput,
  ): Promise<CreateChannelOutput> {
    return this.chatService.createChannel(creator, createChannelInput);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => JoinChannelOutput)
  async joinChannel(
    @AuthUser() user: User,
    @Args('input') joinChannelInput: JoinChannelInput,
  ): Promise<JoinChannelOutput> {
    return this.chatService.joinChannel(user, joinChannelInput);
  }

  @UseGuards(AuthGuard)
  @Query(() => GetChannelOutput)
  async getChannelById(
    @AuthUser() user: User,
    @Args('input') getChannelInput: GetChannelInput,
  ): Promise<GetChannelOutput> {
    return this.chatService.getChannelById(user, getChannelInput);
  }

  @UseGuards(AuthGuard)
  @Query(() => LoadChatsOutput)
  async loadChats(
    @Args('input') loadChatsInput: LoadChatsInput,
  ): Promise<LoadChatsOutput> {
    return this.chatService.loadChats(loadChatsInput);
  }
}
