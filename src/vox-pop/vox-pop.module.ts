import { Module } from '@nestjs/common';
import { VoxPopController } from './vox-pop.controller';
import { VoxPopService } from './vox-pop.service';
import { LoggerService } from '../logger/logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema, Post } from 'src/mongoDB/posts/post.schema';
import { PostsModule } from 'src/mongoDB/posts/posts.module';
import { SubmissionsModule } from 'src/mongoDB/submissions/submissions.module';
import { RejectionsModule } from 'src/mongoDB/rejections/rejections.module';

@Module({
	imports: [PostsModule, SubmissionsModule, RejectionsModule, MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
	exports: [VoxPopService],
	controllers: [VoxPopController],
	providers: [VoxPopService, LoggerService],
})
export class VoxPopModule {}
