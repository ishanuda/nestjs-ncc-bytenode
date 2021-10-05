import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { EnvConfig } from './config';
import { ExcludeNullInterceptor } from './utils';

import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = app.get(ConfigService);
	const PORT = config.get(EnvConfig.PORT);
	app.useGlobalPipes(new ValidationPipe());

	// if using in more controllers, add serializer globally
	// app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
	// app.useGlobalInterceptors(new ExcludeNullInterceptor(app.get(Reflector)));

	app.use(cookieParser());
	app.setGlobalPrefix('api', {
		exclude: ['auth', 'auth/register', 'auth/login', 'auth/logout', 'auth/refresh'],
	});

	await app.listen(PORT);

	const message = `Server started running on http://localhost:${PORT}`;
	console.log(message);
}
bootstrap();
