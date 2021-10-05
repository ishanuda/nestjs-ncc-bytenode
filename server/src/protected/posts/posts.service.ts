import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostNotFoundException } from './exception';
import { PostRepository } from './post.repository';
import { MPost } from '../../database';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
	constructor(
		@InjectRepository(PostRepository)
		private readonly repo: PostRepository,
	) {}

	async getAllPosts(): Promise<MPost[]> {
		return await this.repo.find();
	}

	async getPostById(id: number): Promise<MPost> {
		const post = await this.repo.findOne({ id });
		if (post) {
			return post;
		}
		throw new PostNotFoundException(id);
	}

	async createPost(post: CreatePostDto): Promise<MPost> {
		const item = {
			created: new Date(),
			...post,
		};
		console.log('post', item);
		const result = await this.repo.save(item);
		return result;
	}

	async updatePost(id: number, post: UpdatePostDto): Promise<MPost> {
		console.log('pro', process.env.TYPEORM_DROP_SCHEMA);

		const result = await this.repo.update(id, post);
		const item = this.repo.findOne(id);
		if (item) {
			return item;
		}
		throw new PostNotFoundException(id);
	}

	async deletePost(id: number): Promise<void> {
		const result = await this.repo.delete(id);
		console.log('delete result', result);
		// if (!result.affected) {
		// 	throw new PostNotFoundException(id);
		// }
	}
}
