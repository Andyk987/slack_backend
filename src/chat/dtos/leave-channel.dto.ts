import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Channel } from '../entities/channel.entity';

@ObjectType()
export class LeaveChannelOutput extends CoreOutput {
  @Field(() => Channel, { nullable: true })
  joinedChannel?: Channel;
}
