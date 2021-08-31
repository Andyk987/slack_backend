import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Workspace } from '../entities/workspace.entity';

@InputType()
export class GetCurrentWorkspaceInput extends PickType(Workspace, ['id']) {}

@ObjectType()
export class GetCurrentWorkspaceOutput extends CoreOutput {
  @Field(() => Workspace, { nullable: true })
  workspace?: Workspace;
}
