import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsService } from "./posts.service";
import { PostsController } from './posts.controller';
import { PostSchema, Post, PostDocument } from "./schema/post.schema";
// import mongoose, { Model } from "mongoose";

@Module({
    imports: [MongooseModule.forFeature([{name: Post.name, schema: PostSchema}])],
    providers: [PostsService],
    controllers: [PostsController],
    exports: [PostsService],
})
export class PostsModule {}
// TODO: Figure out how to post to different collections with the same schema 
// export class PostsModule {
//     public postedPosts: any;
//     public notPostedPosts: any

//     constructor() {
//         console.log('!! models: ', mongoose.Model);
        
//         let test = mongoose.Model<PostDocument>
//         console.log(test);
    
//         let Schema = mongoose.Schema;
//         let schema = new Schema({PostSchema});
//         this.postedPosts = mongoose.model('postedPosts', schema);
//         this.notPostedPosts = mongoose.model('notPosts', schema);
//         console.log(this.postedPosts, this.notPostedPosts);
//     }
// }