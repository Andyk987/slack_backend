import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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

  @Mutation(() => CreateWorkplaceOutput)
  async createWorkplace(
    @Args('input') createWorkplaceInput: CreateWorkplaceInput,
  ) {
    return this.chatService.createWorkplace(createWorkplaceInput);
  }

  @Mutation(() => CreateChannelOutput)
  async createChannel(
    @Args('input') createChannelInput: CreateChannelInput,
  ): Promise<CreateChannelOutput> {
    return this.chatService.createChannel(createChannelInput);
  }
}
