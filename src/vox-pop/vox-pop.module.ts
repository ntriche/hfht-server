import { Module } from '@nestjs/common';
import { VoxPopController } from './vox-pop.controller';
import { VoxPopService } from './vox-pop.service';
import { LoggerService } from '../logger/logger.service';
import { PostsModule } from 'src/posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema, Post } from 'src/posts/post.schema';

@Module({
    imports: [PostsModule, MongooseModule.forFeature([{name: Post.name, schema: PostSchema}])],
    exports: [VoxPopService],
    controllers: [VoxPopController],
    providers: [VoxPopService, LoggerService],
})
export class VoxPopModule {}
