import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Channel } from '../entities/channel.entity';

@ObjectType()
export class JoinChannleInput {
  @Field(() => Int)
  channelId: number;
}

@ObjectType()
export class JoinChannleOutput extends CoreOutput {
  @Field(() => Channel, { nullable: true })
  newJoinChannel?: Channel;
}
