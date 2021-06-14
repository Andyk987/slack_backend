import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToMany, ManyToOne, RelationId } from 'typeorm';
import { Workspace } from './workspace.entity';

@InputType('InfoInputType', { isAbstract: true })
@ObjectType()
export class Info {
  @Field(() => String)
  topic: string;

  @Field(() => String, { nullable: true })
  description?: string;
}

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Channel extends CoreEntity {
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

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.joined_channels, {
    onDelete: 'CASCADE',
  })
  members: User[];

  @Field(() => Workspace)
  @ManyToOne(() => Workspace, (workspace) => workspace.channels, {
    onDelete: 'CASCADE',
  })
  workspace: Workspace;

  @RelationId((channel: Channel) => channel.workspace)
  workspaceId: number;
}
