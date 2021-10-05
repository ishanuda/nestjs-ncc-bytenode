// import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdatePostDto {
	// @IsNumber()
	// @IsOptional()
	id: number;

	// @IsString()
	// @IsNotEmpty()
	// @IsOptional()
	title: string;

	// @IsString({ each: true })
	// @IsNotEmpty()
	// @IsOptional()
	content: string; // [];
}
