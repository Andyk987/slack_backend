import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntityUuid } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import { Chat } from './chat.entity';
import { Workspace } from './workspace.entity';

@InputType('InfoInputType', { isAbstract: true })
@ObjectType()
export default class Info {
  @Field(() => String, {
    defaultValue: '주제를 작성해주세요!!',
  })
  topic: string;

  @Field(() => String, {
    defaultValue: '설명란을 작성해주세요!!',
  })
  description: string;
}

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Channel extends CoreEntityUuid {
  @Column()
  @Field(() => String)
  title: string;

  @Column({ type: 'json', nullable: true })
  @Field(() => Info, { nullable: true })
  info?: Info;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.my_channels, {
    onDelete: 'CASCADE',
  })
  creator: User;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.joined_channels, { nullable: true })
  members?: User[];

  @Field(() => Workspace)
  @ManyToOne(() => Workspace, (workspace) => workspace.channels, {
    onDelete: 'CASCADE',
  })
  workspace: Workspace;

  @RelationId((channel: Channel) => channel.workspace)
  workspaceId: string;

  @Field(() => [Chat], { nullable: true })
  @OneToMany(() => Chat, (chat) => chat.channel, { nullable: true })
  chats?: Chat[];
}
