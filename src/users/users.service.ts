import * as bcrypt from 'bcrypt';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from './entities/user.entity';
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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneOrFail({ id });
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
      let hash = '';
      const saltRounds = 10;
      if (password) {
        try {
          hash = await bcrypt.hash(password, saltRounds);
        } catch (error) {
          console.log(error);
          throw new InternalServerErrorException();
        }
      }
      const isMatch = bcrypt.compare(hash, password);
      if (!isMatch) {
        return { ok: false, error: 'encrypt error' };
      }
      const newUser = await this.users.save(
        this.users.create({ email, password: hash }),
      );
      return { ok: true };
    } catch (error) {
      console.log(error);
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
      const checkPassword = await bcrypt.compare(password, user.password);
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
      const passwordIsSame = await bcrypt.compare(password, user.password);
      console.log(passwordIsSame);
      if (passwordIsSame) {
        return {
          ok: false,
          error: 'Password is same as previous',
        };
      }
      let hashPassword = '';
      const saltRounds = 10;
      try {
        hashPassword = await bcrypt.hash(password, saltRounds);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
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
}
