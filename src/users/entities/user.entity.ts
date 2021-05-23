import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
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
  name?: string;

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
  @OneToMany(() => Follow, (follow) => follow.following, {
    nullable: true,
  })
  following: Follow[];

  @Field(() => [Follow], { nullable: true })
  @OneToMany(() => Follow, (follow) => follow.follower, {
    nullable: true,
  })
  followers: Follow[];

  @Field(() => [Channel])
  @OneToMany(() => Channel, (channel) => channel.creator)
  myChannels: Channel[];

  @Field(() => [Channel])
  @ManyToMany(() => Channel, (channel) => channel.members, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  joined_channels: Channel[];

  @Field(() => [Workplace], { nullable: true })
  @OneToMany(() => Workplace, (workplace) => workplace.creator, {
    nullable: true,
  })
  myWorkplaces: Workplace[];

  @Field(() => Workplace)
  @ManyToOne(() => Workplace, (workplace) => workplace.members, {
    onDelete: 'CASCADE',
  })
  joined_workspaces: Workplace;
}
