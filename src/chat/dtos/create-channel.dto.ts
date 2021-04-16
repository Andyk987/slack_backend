import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Channel } from '../entities/channel.entity';

@InputType()
export class CreateChannelInput extends PickType(Channel, ['title', 'info']) {}

@ObjectType()
export class CreateChannelOutput extends CoreOutput {}
