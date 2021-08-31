import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Follow extends CoreEntity {
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  following: User;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  follower: User;
}
