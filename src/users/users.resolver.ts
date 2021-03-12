import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginOutput, LoginInput } from './dtos/login.dto';
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

@Resolver(of => User)
export class UsersResolver {
	constructor(
		private readonly usersService: UsersService,
	) {}
	
	@Query(returns => UserProfileOutput)
	async findById(
		@Args() userProfileInput: UserProfileInput
	): Promise<UserProfileOutput> {
		return this.usersService.findById(userProfileInput.userId);
	}

	@Mutation(returns => CreateAccountOutput)
	async createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
		return this.usersService.createAccount(createAccountInput);
	}

	@Mutation(returns => LoginOutput)
	async login(
		@Args('input') loginInput: LoginInput
	): Promise<LoginOutput> {
		return this.usersService.login(loginInput);
	}
}