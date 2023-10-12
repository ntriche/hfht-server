import { Module } from '@nestjs/common';
import { HfhtLoggerService } from './hfht.logger.service';

@Module({
	providers: [HfhtLoggerService],
    exports: [HfhtLoggerService],
})
export class HfhtLoggerModule {}
