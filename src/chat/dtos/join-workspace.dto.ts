import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Workspace } from '../entities/workspace.entity';

@InputType()
export class JoinWorkspaceInput extends PickType(Workspace, ['id']) {}

@ObjectType()
export class JoinWorkspaceOutput extends CoreOutput {}
