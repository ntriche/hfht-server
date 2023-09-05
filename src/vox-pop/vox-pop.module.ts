import { Module } from '@nestjs/common';
import { VoxPopController } from './vox-pop.controller';
import { VoxPopService } from './vox-pop.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SubmissionsModule } from 'src/submissions/submissions.module';
import { Submission, SubmissionSchema } from 'src/submissions/submissions.schema';

@Module({
	imports: [
		SubmissionsModule, 
		MongooseModule.forFeature([{ name: Submission.name, schema: SubmissionSchema }])
	],
	controllers: [VoxPopController],
	providers: [VoxPopService],
	exports: [VoxPopService],
})
export class VoxPopModule {}
