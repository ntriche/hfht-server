import { Module } from '@nestjs/common';
import { VoxPopModule } from './vox-pop/vox-pop.module';
import { LoggerService } from './logger/logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts/posts.service';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [VoxPopModule, PostsModule, MongooseModule.forRoot('mongodb://localhost/nest')],
  providers: [LoggerService],
})
export class AppModule {}
