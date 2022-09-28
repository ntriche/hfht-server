import { Module } from '@nestjs/common';
import { VoxPopModule } from './vox-pop/vox-pop.module';
import { LoggerService } from './logger/logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/posts.module';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';

@Module({
  imports: [VoxPopModule, PostsModule, MongooseModule.forRoot('mongodb://localhost:27017/vox-pop')],
  providers: [LoggerService, DashboardService],
  controllers: [DashboardController],
})
export class AppModule {}
