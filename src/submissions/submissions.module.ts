import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from './submissions.schema';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Submission.name, schema: SubmissionSchema }])
	],
	controllers: [SubmissionsController],
	providers: [SubmissionsService],
	exports: [SubmissionsService],
})
export class SubmissionsModule {}