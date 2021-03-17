import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class EditPersonalProfileInput extends PickType(User, [
  'firstName',
  'lastName',
  'gender',
  'country',
  'address',
]) {}

@ObjectType()
export class EditPersonalProfileOutput extends CoreOutput {}
