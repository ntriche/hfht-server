import { Module } from '@nestjs/common';
import { VoxPopModule } from 'src/vox-pop/vox-pop.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { LoggerService } from 'src/logger/logger.service';
import { SubmissionsModule } from 'src/mongoDB/submissions/submissions.module';
import { RejectionsModule } from 'src/mongoDB/rejections/rejections.module';
import { PostsModule } from 'src/mongoDB/posts/posts.module';

@Module({
	imports: [VoxPopModule, PostsModule, SubmissionsModule, RejectionsModule],
	providers: [DashboardService, LoggerService],
	controllers: [DashboardController],
})
export class DashboardModule {}
