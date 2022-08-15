import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsService } from "./posts.service";
import { Post, PostSchema } from "./schema/post.schema";
import { PostsController } from './posts.controller';

@Module({
    imports: [MongooseModule.forFeature([{name: Post.name, schema: PostSchema}])],
    providers: [PostsService],
    controllers: [PostsController],
})
export class PostsModule {}