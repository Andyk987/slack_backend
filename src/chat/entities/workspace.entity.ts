import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntityUuid } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Channel } from './channel.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Workspace extends CoreEntityUuid {
  @Column()
  @Field(() => String)
  @IsString({ message: 'not string' })
  title: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  avatarUrl?: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.my_workspaces, {
    onDelete: 'CASCADE',
  })
  creator: User;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.joined_workspaces, {
    nullable: true,
  })
  members: User[];

  @Field(() => [Channel], { nullable: true })
  @OneToMany(() => Channel, (channel) => channel.workspace, {
    nullable: true,
    eager: true,
  })
  channels: Channel[];
}
