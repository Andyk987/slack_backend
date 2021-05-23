import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Workplace } from '../entities/workplace.entity';

@InputType()
export class CreateWorkplaceInput extends PickType(Workplace, [
  'title',
  'avatarUrl',
]) {}

@ObjectType()
export class CreateWorkplaceOutput extends CoreOutput {}
