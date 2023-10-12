import { Global, Module } from '@nestjs/common';
import { HfhtLoggerService } from './hfht.logger.service';

@Global()
@Module({
	providers: [HfhtLoggerService],
    exports: [HfhtLoggerService],
})
export class HfhtLoggerModule {}
