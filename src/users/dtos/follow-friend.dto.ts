import { Field, InputType, ObjectType, Int } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class FollowFriendInput {
	@Field(type => Int)
	friendId: number;
}

@ObjectType()
export class FollowFriendOutput extends CoreOutput {}