import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from './submissions.schema';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { HfhtLoggerModule } from 'src/logger/hfht.logger.module';

@Module({
	imports: [
		HfhtLoggerModule,
		MongooseModule.forFeature([{ name: Submission.name, schema: SubmissionSchema }])
	],
	controllers: [SubmissionsController],
	providers: [SubmissionsService],
	exports: [SubmissionsService],
})
export class SubmissionsModule {}