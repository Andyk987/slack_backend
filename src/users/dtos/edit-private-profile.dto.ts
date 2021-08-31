import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class EditPrivateProfileInput extends PartialType(
  PickType(User, ['password']),
) {}

@ObjectType()
export class EditPrivateProfileOutput extends CoreOutput {}
