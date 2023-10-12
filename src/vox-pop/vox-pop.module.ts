import { Module } from '@nestjs/common';
import { VoxPopController } from './vox-pop.controller';
import { VoxPopService } from './vox-pop.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SubmissionsModule } from 'src/submissions/submissions.module';
import { Submission, SubmissionSchema } from 'src/submissions/submissions.schema';
import { HfhtLoggerModule } from 'src/logger/hfht.logger.module';

@Module({
	imports: [
		HfhtLoggerModule,
		SubmissionsModule,
		MongooseModule.forFeature([{ name: Submission.name, schema: SubmissionSchema }])
	],
	controllers: [VoxPopController],
	providers: [VoxPopService],
	exports: [VoxPopService],
})
export class VoxPopModule {}
