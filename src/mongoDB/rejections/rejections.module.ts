import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RejectionsService } from './rejections.service';
import { RejectionsController } from './rejections.controller';
import { Rejection, RejectionSchema } from './rejections.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: Rejection.name, schema: RejectionSchema }])],
	providers: [RejectionsService],
	controllers: [RejectionsController],
	exports: [RejectionsService],
})
export class RejectionsModule {}
