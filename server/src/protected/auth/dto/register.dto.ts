import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsEmail()
	email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(20)
	password: string;

	@IsString()
	@IsNotEmpty()
	// @Matches(/^\+[1-9]\d{1,14}$/)
	phoneNumber: string;
}
