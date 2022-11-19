import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsService } from "./posts.service";
import { PostsController } from './posts.controller';
import { PostSchema, Post } from "./post.schema";
// import mongoose, { Model } from "mongoose";

@Module({
    imports: [MongooseModule.forFeature([{name: Post.name, schema: PostSchema}])],
    providers: [PostsService],
    controllers: [PostsController],
    exports: [PostsService],
})
export class PostsModule {}