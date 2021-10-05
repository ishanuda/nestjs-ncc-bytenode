import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { AuthService } from './auth.service';
import { EnvConfig } from '../../config';
import { AuthController } from './auth.controller';

@Module({
	imports: [
		ConfigModule,
		PassportModule,
		JwtModule.register({}),
		// JwtModule.registerAsync({
		// 	imports: [ConfigModule],
		// 	inject: [ConfigService],
		// 	useFactory: async (config: ConfigService) => ({
		// 		secret: config.get(EnvConfig.JWT_ACCESS_TOKEN_SECRET),
		// 		signOptions: {
		// 			expiresIn: `${config.get(EnvConfig.JWT_ACCESS_TOKEN_EXPIRATION_TIME)}s`,
		// 		},
		// 	}),
		// }),
		UsersModule,
	],
	controllers: [AuthController],
	providers: [LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy, AuthService],
})
export class AutheModule {}
