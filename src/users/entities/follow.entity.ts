import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, RelationId } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Follow extends CoreEntity {
    @Field((type) => User, { nullable: true })
    @ManyToOne((type) => User, (user) => user.following, { onDelete: 'CASCADE' })
    following: User;

    @Field((type) => User)
    @ManyToOne((type) => User, (user) => user.followers)
    follower: User;
}