import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToMany, ManyToOne, RelationId } from 'typeorm';
import { Workplace } from './workplace.entity';

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
  @ManyToOne(() => User, (user) => user.myChannels, {
    onDelete: 'CASCADE',
  })
  creator: User;

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.joined_channels, {
    onDelete: 'CASCADE',
  })
  members: User[];

  @Field(() => Workplace)
  @ManyToOne(() => Workplace, (workplace) => workplace.channels, {
    onDelete: 'CASCADE',
  })
  workplace: Workplace;

  @RelationId((channel: Channel) => channel.workplace)
  workplaceId: number;
}
