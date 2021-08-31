import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from './entities/user.entity';
import { Follow } from './entities/follow.entity';
import {
  FollowFriendInput,
  FollowFriendOutput,
} from './dtos/follow-friend.dto';
import { UserProfileOutput } from './dtos/user-profile.dto';
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
import { HashPasswordRepository } from './repositories/hash-password.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Follow)
    private readonly follow: Repository<Follow>,
    private readonly jwtService: JwtService,
    private readonly hashPasswordRepository: HashPasswordRepository,
  ) {}

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneOrFail(
        { id },
        { relations: ['joined_channels'] },
      );
      return { ok: true, user };
    } catch (error) {
      return { ok: false, error: 'User Not Found' };
    }
  }

  async createAccount({
    email,
    password,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const isUserExist = await this.users.findOne({ email });
      if (isUserExist) {
        return { ok: false, error: 'This email is already exists' };
      }
      const saltRounds = 10;
      const hash = await this.hashPasswordRepository.hashPassword(
        password,
        saltRounds,
      );
      const isMatch = await this.hashPasswordRepository.compareHashPassword(
        password,
        hash,
      );
      if (!isMatch) {
        return { ok: false, error: 'encrypt error' };
      }
      await this.users.save(this.users.create({ email, password: hash }));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: "You can't create an account" };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({ email });
      if (!user) {
        return {
          ok: false,
          error: 'Confirm that email does not exist',
        };
      }
      const checkPassword = await this.hashPasswordRepository.compareHashPassword(
        password,
        user.password,
      );
      if (!checkPassword) {
        return {
          ok: false,
          error: 'Password is not correct!',
        };
      }
      const token = await this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch {
      return {
        ok: false,
        error: "Can't Log in",
      };
    }
  }

  async editPersonalProfile(
    authUser: User,
    editPersonalProfileInput: EditPersonalProfileInput,
  ): Promise<EditPersonalProfileOutput> {
    try {
      const user = await this.users.findOne(authUser.id);
      if (!user) {
        return {
          ok: true,
          error: 'no user found',
        };
      }
      for (const [editProfileInput, inputValue] of Object.entries(
        editPersonalProfileInput,
      )) {
        user[editProfileInput] = inputValue;
      }
      await this.users.save(user);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: "Can't edit profile",
      };
    }
  }

  async editPrivateProfile(
    authUser: User,
    { password }: EditPrivateProfileInput,
  ): Promise<EditPrivateProfileOutput> {
    try {
      const user = await this.users.findOne(authUser.id);
      if (!user) {
        return {
          ok: false,
          error: "Can't find the user",
        };
      }
      const passwordIsSame = await this.hashPasswordRepository.compareHashPassword(
        password,
        user.password,
      );
      if (passwordIsSame) {
        return {
          ok: false,
          error: 'Password is same as previous',
        };
      }
      const saltRounds = 10;
      const hashPassword = await this.hashPasswordRepository.hashPassword(
        password,
        saltRounds,
      );
      const isMatch = await this.hashPasswordRepository.compareHashPassword(
        password,
        hashPassword,
      );
      if (!isMatch) {
        return { ok: false, error: 'encrypt error' };
      }
      user.password = hashPassword;
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: "Can't edit profile",
      };
    }
  }

  async followFriend(
    followerId: number,
    { friendId }: FollowFriendInput,
  ): Promise<FollowFriendOutput> {
    try {
      const follower = await this.users.findOne(followerId, {
        relations: ['following', 'followers'],
      });
      const followingFriend = await this.users.findOne(friendId);
      if (!followingFriend) {
        return {
          ok: false,
          error: "Can't find the friend",
        };
      }
      await this.follow.save(
        this.follow.create({ following: followingFriend, follower }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: "You can't add a friend",
      };
    }
  }

  async getFollowingFriend(authUser: User): Promise<FollowingFriendsOutput> {
    try {
      // const followingFriends = await this.follow.find({
      //     where: { follower: authUser },
      //     relations: ['following'],
      // });
      const followingFriends = await getRepository(Follow)
        .createQueryBuilder('follow')
        .leftJoinAndSelect('follow.following', 'user')
        .where('follow.follower.id = :id', { id: authUser.id })
        .getMany();
      return {
        ok: true,
        followingFriends,
      };
    } catch (error) {
      return {
        ok: error,
        error: "You can't get following friend",
      };
    }
  }
}
