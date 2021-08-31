import {
    Field,
    InputType,
    Int,
    ObjectType,
    PartialType,
    PickType,
  } from '@nestjs/graphql';
  import { CoreOutput } from 'src/common/dtos/output.dto';
  import Info, { Channel } from '../entities/channel.entity';
  import { Chat } from '../entities/chat.entity';
  
  @ObjectType({ isAbstract: true })
  export class ChatWithOptions extends PartialType(Chat) {
    @Field(() => Boolean, { nullable: true })
    isLastChatOfDay?: boolean;
  }
  
  @ObjectType({ isAbstract: true })
  export class GetChannel {
    @Field(() => String, { nullable: true })
    id?: Channel['id'];
  
    @Field(() => Date, { nullable: true })
    createAt?: Channel['createAt'];
  
    @Field(() => String, { nullable: true })
    title?: Channel['title'];
  
    @Field(() => Info, { nullable: true })
    info?: Channel['info'];
  
    @Field(() => [ChatWithOptions], { nullable: true })
    chats?: ChatWithOptions[];
  
    @Field(() => Int, { nullable: true })
    totalCounts?: number;
  }
  
  @InputType()
  export class GetChannelInput extends PickType(Channel, ['id']) {
    @Field(() => String)
    workspaceId: string;
  
    @Field(() => Int, { nullable: true })
    limit?: number;
  }
  
  @ObjectType()
  export class GetChannelOutput extends CoreOutput {
    @Field(() => GetChannel, { nullable: true })
    getChannel?: GetChannel;
  
    @Field(() => Boolean, { nullable: true })
    joined?: boolean;
  }
  