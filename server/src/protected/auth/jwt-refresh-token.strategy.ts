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
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request?.cookies?.Refresh;
				},
			]),
			secretOrKey: configService.get(EnvConfig.JWT_REFRESH_TOKEN_SECRET),

			// we can access the cookies in our validate method bellow
			passReqToCallback: true,
		});
	}

	async validate(request: Request, payload: TokenPayload): Promise<User> {
		const refreshToken = request?.cookies?.Refresh;
		return await this.userService.getUserIfRefreshTokenMatches(refreshToken, payload.userId);
	}
}
