import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Channel } from './channel.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Workplace extends CoreEntity {
  @Column()
  @Field(() => String)
  title: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  avatarUrl?: string;

  @Field(() => [Channel], { nullable: true })
  @OneToMany(() => Channel, (channel) => channel.workplace, {
    nullable: true,
  })
  channels: Channel[];

  @Field(() => [User], { nullable: true })
  @OneToMany(() => User, (user) => user.workplace, {
    nullable: true,
  })
  signedUsers: User[];
}
