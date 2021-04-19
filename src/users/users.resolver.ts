import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import {
  FollowFriendInput,
  FollowFriendOutput,
} from './dtos/follow-friend.dto';
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
import { FollowingFriendsOutput } from './dtos/following-friends.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserProfileOutput)
  async findById(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.usersService.findById(userProfileInput.userId);
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  async me(@AuthUser() user: User): Promise<User> {
    return user;
  }

  @Mutation(() => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => EditPersonalProfileOutput)
  async editPersonalProfile(
    @AuthUser() authUser: User,
    @Args('input') editPersonalProfileInput: EditPersonalProfileInput,
  ): Promise<EditPersonalProfileOutput> {
    return this.usersService.editPersonalProfile(
      authUser,
      editPersonalProfileInput,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => EditPrivateProfileOutput)
  async editPrivateProfile(
    @AuthUser() authUser: User,
    @Args('input') editPrivateProfileInput: EditPrivateProfileInput,
  ): Promise<EditPrivateProfileOutput> {
    return this.usersService.editPrivateProfile(
      authUser,
      editPrivateProfileInput,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => FollowFriendOutput)
  async followFriend(
    @AuthUser() authUser: User,
    @Args('input') followFriendInput: FollowFriendInput,
  ): Promise<FollowFriendOutput> {
    return this.usersService.followFriend(authUser.id, followFriendInput);
  }

  @UseGuards(AuthGuard)
  @Query(() => FollowingFriendsOutput)
  async getFollowingFriend(
    @AuthUser() authUser: User,
  ): Promise<FollowingFriendsOutput> {
    return this.usersService.getFollowingFriend(authUser);
  }
}
