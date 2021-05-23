import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly commonService: CommonService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;
    if (!token) return false;
    const user = await this.commonService.getUserByToken(token);
    if (!user) return false;
    gqlContext['user'] = user;
    return true;
  }
}
