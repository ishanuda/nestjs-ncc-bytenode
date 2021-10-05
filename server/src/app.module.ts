import { Module } from '@nestjs/common';
import * as path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { validate } from './config/env.validation';
import typeOrmConfig from './config/typeorm.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AutheModule, UsersModule, PostsModule } from './protected';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: path.resolve(__dirname, '../env', '.env'),
			validate,
			validationOptions: {
				allowUnknown: false,
				abortEarly: true,
			},
			load: [typeOrmConfig],
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => await config.get('database'),
			inject: [ConfigService],
		}),

		AutheModule,
		UsersModule,
		PostsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
