import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Chat } from '../entities/chat.entity';

@InputType()
export class SaveChatInput extends PickType(Chat, ['context', 'timeStamp']) {
  @Field(() => String)
  channelId: string;
}

@ObjectType()
export class SaveChatOutput extends CoreOutput {}
