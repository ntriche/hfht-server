import { Module } from '@nestjs/common';
import { VoxPopModule } from 'src/vox-pop/vox-pop.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
    imports: [VoxPopModule],
    providers: [DashboardService],
    controllers: [DashboardController]
})
export class DashboardModule {}
