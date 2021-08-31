import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Follow } from './follow.entity';
import { Channel } from 'src/chat/entities/channel.entity';
import { Workspace } from 'src/chat/entities/workspace.entity';
import { Chat } from 'src/chat/entities/chat.entity';

export enum Gender {
  MALE,
  FEMALE,
}

export enum UserRole {
  OWNER,
  PARTICIPANT,
}

registerEnumType(Gender, {
  name: 'UserGender',
});

registerEnumType(UserRole, {
  name: 'UserRole',
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
  my_channels: Channel[];

  @Field(() => [Channel], { nullable: true })
  @ManyToMany(() => Channel, (channel) => channel.members, {
    onDelete: 'CASCADE',
    eager: true,
    nullable: true,
  })
  @JoinTable()
  joined_channels?: Channel[];

  @Field(() => [Workspace], { nullable: true })
  @OneToMany(() => Workspace, (workplace) => workplace.creator, {
    nullable: true,
    eager: true,
  })
  my_workspaces: Workspace[];

  @Field(() => [Workspace])
  @ManyToMany(() => Workspace, (workspace) => workspace.members, {
    eager: true,
  })
  @JoinTable()
  joined_workspaces: Workspace[];

  @Field(() => [Chat], { nullable: true })
  @OneToMany(() => Chat, (chat) => chat.user, { nullable: true })
  chats?: Chat[];
}
