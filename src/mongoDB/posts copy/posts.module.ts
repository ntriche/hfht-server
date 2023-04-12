import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from '../posts/posts.service'
import { PostsController } from '../posts/posts.controller';
import { PostSchema, Post } from '../posts/post.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
	providers: [PostsService],
	controllers: [PostsController],
	exports: [PostsService],
})
export class PostsModule {}
