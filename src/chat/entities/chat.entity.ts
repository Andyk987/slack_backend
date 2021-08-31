import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntityUuid } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { BeforeInsert, Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Channel } from './channel.entity';

type ValueOf<T> = T[keyof T];

export enum DataType {
  Loading = 'Loading',
  Context = 'Context',
}

registerEnumType(DataType, {
  name: 'ChatDataType',
});

interface ChatData {
  context: string;
  image: number;
}

@ObjectType()
@Entity()
export class Chat extends CoreEntityUuid {
  @Column({ type: 'enum', enum: DataType, default: DataType.Context })
  @Field(() => DataType, { defaultValue: DataType.Context })
  dataType: DataType;

  // @Column({ type: "character" || "integer", nullable: true })
  // @Field(() => String || Number, { nullable: true })
  // chatData?: string | number;

  @Column()
  @Field(() => String)
  context: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  image?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date)
  timeStamp: Date;

  @Field(() => Channel)
  @ManyToOne(() => Channel, (channel) => channel.chats, {
    onDelete: 'CASCADE',
  })
  channel: Channel;

  @RelationId((chat: Chat) => chat.channel)
  channelId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.chats)
  user: User;
}
