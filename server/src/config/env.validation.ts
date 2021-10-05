import { plainToClass, Transform } from 'class-transformer';
import { IsString, IsNumber, IsEnum, IsBoolean, IsEmpty, validateSync } from 'class-validator';

/**
 * @see https://docs.nestjs.com/techniques/configuration
 */

export function ToBoolean() {
	return Transform((o: any) => {
		// console.log('value', v);
		const { value, key, obj } = o;
		// console.error('value', obj[key]);
		const v = obj[key];
		// if (['1', 'true', 'on', 'yes', 1, true].includes(v)) {
		if (v === 'true') {
			return true;
		}
		// if (['0', 'false', 'off', 'no', 0, false].includes(v)) {
		if (v === 'false') {
			return false;
		}
	});
}

enum Environment {
	DEVELOPMENT = 'development',
	PRODUCTION = 'production',
	TEST = 'test',
	PROVISION = 'provision',
}

class EnvironmentVariables {
	@IsEnum(Environment)
	NODE_ENV: Environment;

	@IsNumber()
	PORT: number;

	// JWT token
	@IsString()
	JWT_ACCESS_TOKEN_SECRET: string;

	@IsNumber()
	JWT_ACCESS_TOKEN_EXPIRATION_TIME: number;

	@IsString()
	JWT_REFRESH_TOKEN_SECRET: string;

	@IsNumber()
	JWT_REFRESH_TOKEN_EXPIRATION_TIME: number;

	// database configurations
	@IsString()
	ORM_TYPE: string;

	@IsString()
	ORM_DATABASE: string;

	@IsString()
	ORM_ENTITIES: string;

	@ToBoolean()
	@IsBoolean()
	ORM_AUTO_LOAD_ENTITIES: boolean;

	@ToBoolean()
	@IsBoolean()
	ORM_DROP_SCHEMA: boolean;

	@ToBoolean()
	@IsBoolean()
	ORM_SYNCHRONIZE: boolean;

	@ToBoolean()
	@IsBoolean()
	ORM_LOGGING: boolean;
}

export function validate(config: Record<string, unknown>) {
	const validatedConfig = plainToClass(EnvironmentVariables, config, {
		enableImplicitConversion: true,
	});

	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false,
	});

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}
	return validatedConfig;
}
