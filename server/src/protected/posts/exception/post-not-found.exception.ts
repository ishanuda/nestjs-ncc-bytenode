import { NotFoundException } from '@nestjs/common';

export class PostNotFoundException extends NotFoundException {
	constructor(postId: number) {
		super(`Post widh id ${postId} not found`);
	}
}
