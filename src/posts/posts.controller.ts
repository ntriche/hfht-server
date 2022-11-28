import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post } from './post.schema';

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}
	
	@Get()
	async getPosts(): Promise<Post[]> {
		return this.postsService.find({});
	}
}
