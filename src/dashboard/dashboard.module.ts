import { Module } from '@nestjs/common';
import { VoxPopModule } from 'src/vox-pop/vox-pop.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { SubmissionsModule } from 'src/mongoDB/submissions/submissions.module';

@Module({
	imports: [VoxPopModule, SubmissionsModule],
	providers: [DashboardService],
	controllers: [DashboardController],
})
export class DashboardModule {}