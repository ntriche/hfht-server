import { Module } from '@nestjs/common';
import { TumblrService } from './tumblr.service';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  providers: [TumblrService, LoggerService]
})
export class TumblrModule {}
