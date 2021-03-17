import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginOutput, LoginInput } from './dtos/login.dto';
import {
  EditPersonalProfileInput,
  EditPersonalProfileOutput,
} from './dtos/edit-personal-profile.dto';
import {
  EditPrivateProfileInput,
  EditPrivateProfileOutput,
} from './dtos/edit-private-profile.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => UserProfileOutput)
  async findById(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.usersService.findById(userProfileInput.userId);
  }

  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Mutation((returns) => EditPersonalProfileOutput)
  async editPersonalProfile(
    @AuthUser() authUser: User,
    @Args('input') editPersonalProfileInput: EditPersonalProfileInput,
  ): Promise<EditPersonalProfileOutput> {
    return this.usersService.editPersonalProfile(
      authUser,
      editPersonalProfileInput,
    );
  }

  @Mutation((returns) => EditPrivateProfileOutput)
  async editPrivateProfile(
    @AuthUser() authUser: User,
    @Args('input') editPrivateProfileInput: EditPrivateProfileInput,
  ): Promise<EditPrivateProfileOutput> {
    return this.usersService.editPrivateProfile(
      authUser,
      editPrivateProfileInput,
    );
  }
}
