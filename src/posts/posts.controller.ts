import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post } from './schema/post.schema'

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    async getUsers(): Promise<Post[]> {
        return this.postsService.getPosts();
    }
}
