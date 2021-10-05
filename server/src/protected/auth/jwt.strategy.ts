import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { TokenPayload } from './token-payload.interface';
import { EnvConfig } from '../../config';
import { User } from 'src/database';

/**
 * read the token from the Cookie header when the user requests data
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request?.cookies?.Authentication;
				},
			]),
			// secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
			secretOrKey: configService.get(EnvConfig.JWT_ACCESS_TOKEN_SECRET),
		});
	}

	async validate(payload: TokenPayload): Promise<User> {
		return await this.userService.getById(payload.userId);
	}
}
