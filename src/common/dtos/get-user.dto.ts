import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { CoreOutput } from './output.dto';

@ObjectType()
export class GetUserByTokenInput {
  @Field(() => String)
  token: string;
}

@ObjectType()
export class GetUserByTokenOutput extends CoreOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
