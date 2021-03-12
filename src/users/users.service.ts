import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from './entities/user.entity';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginOutput, LoginInput } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly users: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    async findById(id: number): Promise<UserProfileOutput> {
        try {
            const user = await this.users.findOneOrFail({ id });
            return { ok: true, user };
        } catch (error) {
            return { ok: false, error: 'User Not Found' };
        }
    };

    async createAccount({ email, password }: CreateAccountInput): Promise<CreateAccountOutput> {
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
            const newUser = await this.users.save(this.users.create({ email, password: hash }));
            return { ok: true };
        } catch (error) {
            console.log(error);
            return { ok: false, error: "You can't create an account" };
        }
    };

	async login({ email, password }: LoginInput): Promise<LoginOutput> {
		try {
			const user = await this.users.findOne({ email });
			if(!user) {
				return {
					ok: false,
					error: "Confirm that email does not exist",
				}
			}
			const checkPassword = await bcrypt.compare(user.password, password);
			if(!checkPassword) {
				return {
					ok: false,
					error: "Passwod is not correct!",
				}
			}
			
			return {
				ok: true
			}
		} catch {
			return {
				ok: false,
				error: "Can't Log in",
			}
		}
	}
}