// import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
	// @IsString()
	// @IsNotEmpty()
	title: string;

	// @IsString({ each: true })
	// @IsNotEmpty()
	content: string; //[];
}
