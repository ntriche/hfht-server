import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VoxPopController } from './vox-pop/vox-pop.controller';

@Module({
  imports: [],
  controllers: [AppController, VoxPopController],
  providers: [AppService],
})
export class AppModule {}
