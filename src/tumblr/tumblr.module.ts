import { Module } from '@nestjs/common';
import { TumblrService } from './tumblr.service';

@Module({
  providers: [TumblrService],
  exports: [TumblrService],
})
export class TumblrModule {}