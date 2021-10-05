import { Controller, UseGuards, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { MPost } from '../../database';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
	constructor(private readonly postService: PostsService) {}

	@Get()
	async getAllPosts(): Promise<MPost[]> {
		return await this.postService.getAllPosts();
	}

	@Get(':id')
	async getPostById(@Param('id') id: number): Promise<MPost> {
		return await this.postService.getPostById(id);
	}

	@Post()
	// @UseGuards(JwtAuthGuard)
	async createPost(@Body() post: CreatePostDto): Promise<MPost> {
		return await this.postService.createPost(post);
	}

	@Put(':id')
	async updatePost(@Param('id') id: number, @Body() post: UpdatePostDto): Promise<MPost> {
		return await this.postService.updatePost(id, post);
	}

	@Delete(':id')
	async deletePost(@Param('id') id: number): Promise<void> {
		await this.postService.deletePost(id);
	}
}
