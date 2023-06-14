import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from './submissions.schema';
import { SubmissionsService } from './submissions.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: Submission.name, schema: SubmissionSchema }])],
	providers: [SubmissionsService],
	exports: [SubmissionsService],
})
export class SubmissionsModule {}