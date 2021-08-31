import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Channel } from '../entities/channel.entity';

@InputType()
export class JoinChannelInput extends PickType(Channel, ['id']) {}

@ObjectType()
export class JoinChannelOutput extends CoreOutput {}
