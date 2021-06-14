import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Workspace } from '../entities/workspace.entity';

@InputType()
export class CreateWorkspaceInput extends PickType(Workspace, [
  'title',
  'avatarUrl',
]) {}

@ObjectType()
export class CreateWorkSpaceOutput extends CoreOutput {}
