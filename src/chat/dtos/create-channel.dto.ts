import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Channel } from '../entities/channel.entity';

@InputType()
export class CreateChannelInput extends PickType(Channel, ['title', 'info']) {
  @Field(() => Int)
  workspaceId: number;
}

@ObjectType()
export class CreateChannelOutput extends CoreOutput {
  @Field(() => Channel, { nullable: true })
  newChannel?: Channel;
}
