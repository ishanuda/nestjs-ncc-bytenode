import {
	Controller,
	HttpCode,
	UseGuards,
	Req,
	Res,
	Get,
	Post,
	Body,
	UseInterceptors,
	ClassSerializerInterceptor,
	SerializeOptions,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { User } from '../../database';
import { RegisterDto } from './dto/register.dto';
import { RequestWithUser } from './request-with-user.interface';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { AuthService } from './auth.service';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
// @SerializeOptions({
// 	strategy: 'excludeAll',
// })
export class AuthController {
	constructor(private readonly usersService: UsersService, private readonly service: AuthService) {}

	@Post('register')
	async register(@Body() dto: RegisterDto): Promise<User> {
		const user = await this.service.register(dto);
		//TODO: send email verification link
		return user;
	}

	// we use  @HttpCode(200) because NestJS responds with 201 Created for POST requests by default
	@Post('login')
	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	async login(@Req() request: RequestWithUser): Promise<User> {
		const { user } = request;
		const accessTokenCookie = this.service.getCookieWithJwtAccessToken(user.id);
		const { cookie: refreshTokenCookie, token: efreshToken } =
			this.service.getCookieWithJwtRefreshToken(user.id);

		const result = await this.usersService.updateRefreshToken(efreshToken, user.id);

		// response.setHeader('Set-Cookie', cookie);
		// user.password = undefined;
		// return response.send(user);

		/**
		 * Issues with using the @Res() decorator above
		 * It interferes with the  ClassSerializerInterceptor
		 */
		request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
		return user;
	}

	@Post('logout')
	@HttpCode(200)
	// @UseGuards(JwtAuthGuard)
	async logout(
		@Req() request: RequestWithUser,
		// @Res() response: Response
	): Promise<any> {
		// console.log('res', response);

		const cookie = this.service.getCookieForLogout();
		// response.setHeader('Set-Cookie', cookie);
		request.res.setHeader('Set-Cookie', cookie);
		// return response.sendStatus(200);
		return '';
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	async authenticate(@Req() request: RequestWithUser): Promise<void> {
		const { user } = request;
		const result = this.usersService.revokeRefreshToken(user.id);
		request.res.setHeader('Set-Cookie', this.service.getCookieForLogout());
	}

	@Get('refresh')
	@UseGuards(JwtRefreshGuard)
	async refresh(@Req() request: RequestWithUser): Promise<any> {
		const { user } = request;
		const accessTokenCookie = this.service.getCookieWithJwtAccessToken(user.id);
		request.res.setHeader('Set-Cookie', accessTokenCookie);
		return user;
	}
}
