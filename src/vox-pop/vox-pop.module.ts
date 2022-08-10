import { Module } from '@nestjs/common';
import { VoxPopController } from './vox-pop.controller';
import { VoxPopService } from './vox-pop.service';
import { LoggerService } from '../logger/logger.service';

@Module({
    controllers: [VoxPopController],
    providers: [VoxPopService, LoggerService],
})
export class VoxPopModule {}
