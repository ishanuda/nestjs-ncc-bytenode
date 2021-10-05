import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from '../../database';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserRepository)
		private readonly repo: UserRepository,
	) {}

	async getById(id: number): Promise<User> {
		const user = await this.repo.findOne({ id });
		if (user) {
			return user;
		}
		throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
	}

	async getUserIfRefreshTokenMatches(refreshToken: string, userId: number): Promise<User> {
		const user = await this.getById(userId);
		const isTokenMatch = await bcryptjs.compare(refreshToken, user.refreshToken);
		if (isTokenMatch) {
			return user;
		}
		return null;
	}

	async getByEmail(email: string): Promise<User> {
		const item = await this.repo.findOne({ email });
		if (item) {
			return item;
		}
		throw new HttpException('User with the email does not exist', HttpStatus.NOT_FOUND);
	}

	async create(user: CreateUserDto): Promise<User> {
		const item = {
			created: new Date(),
			...user,
		};
		const result = await this.repo.save(item);
		return result;
	}

	async updateRefreshToken(refreshToken: string, userId: number): Promise<void> {
		const hashedRefreshToken = await bcryptjs.hash(refreshToken, 10);
		const result = await this.repo.update(userId, { refreshToken: hashedRefreshToken });
		console.log('Refresh token update result', result);
	}

	async revokeRefreshToken(userId: number): Promise<any> {
		const result = await this.repo.update(userId, { refreshToken: null });
		return result;
	}
}
