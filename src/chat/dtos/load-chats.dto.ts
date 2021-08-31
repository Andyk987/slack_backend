import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Channel } from '../entities/channel.entity';
import { ChatWithOptions } from './get-channel.dto';

@InputType()
export class LoadChatsInput extends PickType(Channel, ['id']) {
  @Field(() => Int)
  skipNumber: number;
}

@ObjectType()
export class LoadChatsOutput extends CoreOutput {
  @Field(() => [ChatWithOptions], { nullable: true })
  loadChats?: ChatWithOptions[];

  @Field(() => Int, { nullable: true })
  totalChats?: number;

  @Field(() => String, { nullable: true })
  splitId?: string;
}
