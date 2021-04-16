import { ObjectType, Field } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Follow } from '../entities/follow.entity';

@ObjectType()
export class FollowingFriendsOutput extends CoreOutput {
  @Field((type) => [Follow])
  followingFriends?: Follow[];
}
