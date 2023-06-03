import { Module } from '@nestjs/common';
import { TumblrService } from './tumblr.service';

@Module({
  providers: [TumblrService]
})
export class TumblrModule {}