import { Module } from '@nestjs/common';
import { VoxPopModule } from 'src/vox-pop/vox-pop.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { LoggerService } from 'src/logger/logger.service';

@Module({
	imports: [VoxPopModule],
	providers: [DashboardService, LoggerService],
	controllers: [DashboardController],
})
export class DashboardModule {}
