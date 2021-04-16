import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Follow } from './follow.entity';
import { Channel } from 'src/chat/entities/channel.entity';
import { Workplace } from 'src/chat/entities/workplace.entity';

export enum Gender {
  MALE,
  FEMALE,
}

registerEnumType(Gender, {
  name: 'userGender',
});

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  lastName?: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  password: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  @Field(() => Gender, { nullable: true })
  gender?: Gender;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  country?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => [Follow], { nullable: true })
  @OneToMany(() => Follow, (follow) => follow.following)
  following: Follow[];

  @Field(() => [Follow])
  @OneToMany(() => Follow, (follow) => follow.follower)
  followers: Follow[];

  @Field(() => [Channel])
  @ManyToMany(() => Channel, (channel) => channel.users)
  channels: Channel[];

  @Field(() => Workplace)
  @ManyToOne(() => Workplace, (workplace) => workplace.signedUsers)
  workplace: Workplace;
}
