import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { User, Sqlite3ErrorCode } from '../../database';
import { EnvConfig } from '../../config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { TokenPayload } from './token-payload.interface';

@Injectable()
export class AuthService {
	constructor(
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly userService: UsersService,
	) {}

	async register(data: RegisterDto): Promise<User> {
		const hashedPassword = await bcryptjs.hash(data.password, 10);
		console.log('hashedPassword', hashedPassword);
		try {
			const item = {
				created: new Date(),
				...data,
				password: hashedPassword,
			};
			const result = await this.userService.create(item);
			result.password = undefined;
			return result;
		} catch (error: any) {
			if (error?.errno === Sqlite3ErrorCode.SQLITE_CONSTRAINT_UNIQUE) {
				throw new HttpException(
					'User with the email address already exists',
					HttpStatus.BAD_REQUEST,
				);
			}
			throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async getAuthenticatedUser(email: string, password: string): Promise<User> {
		try {
			const item = await this.userService.getByEmail(email);
			await this.verifyPassword(password, item.password);
			item.password = undefined;
			return item;
		} catch (error: any) {
			throw new HttpException('Wrong credentials provided', HttpStatus.UNAUTHORIZED);
		}
	}

	private async verifyPassword(password: string, hashedPassword: string): Promise<void> {
		const isPasswordMatching = await bcryptjs.compare(password, hashedPassword);
		if (!isPasswordMatching) {
			throw new HttpException('Wrong credentials provided', HttpStatus.UNAUTHORIZED);
		}
	}

	public getCookieWithJwtAccessToken(userId: number): string {
		const payload: TokenPayload = { userId };
		const token = this.jwtService.sign(payload, {
			secret: this.configService.get(EnvConfig.JWT_ACCESS_TOKEN_SECRET),
			expiresIn: `${this.configService.get(EnvConfig.JWT_ACCESS_TOKEN_EXPIRATION_TIME)}s`,
		});

		const cookieStrArr = [
			`Authentication=${token};`,
			'HttpOnly;',
			'Path=/;',
			`Max-Age=${this.configService.get(EnvConfig.JWT_ACCESS_TOKEN_EXPIRATION_TIME)}`,
		];

		// return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
		// 	'JWT_EXPIRATION_TIME',
		// )}`;
		return cookieStrArr.join(' ');
	}

	public getCookieWithJwtRefreshToken(userId: number): { cookie: string; token: string } {
		const payload: TokenPayload = { userId };
		const token = this.jwtService.sign(payload, {
			secret: this.configService.get(EnvConfig.JWT_REFRESH_TOKEN_SECRET),
			expiresIn: `${this.configService.get(EnvConfig.JWT_REFRESH_TOKEN_EXPIRATION_TIME)}s`,
		});

		const cookieStrArr = [
			`Refresh=${token};`,
			'HttpOnly;',
			'Path=/;',
			`Max-Age=${this.configService.get(EnvConfig.JWT_REFRESH_TOKEN_EXPIRATION_TIME)}`,
		];

		// return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
		// 	'JWT_EXPIRATION_TIME',
		// )}`;
		const cookie = cookieStrArr.join(' ');
		return { cookie, token };
	}

	public getCookieForLogout(): string[] {
		return [
			`Authentication=; HttpOnly; Path=/; Max-Age=0`,
			`Refresh=; HttpOnly; Path=/; Max-Age=0`,
		];
	}
}
