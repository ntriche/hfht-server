import { Module } from '@nestjs/common';
import { VoxPopModule } from './vox-pop/vox-pop.module';
import { LoggerService } from './logger/logger.service';

@Module({
  imports: [VoxPopModule],
  providers: [LoggerService],
})
export class AppModule {}
