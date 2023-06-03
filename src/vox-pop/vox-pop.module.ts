import { Module } from '@nestjs/common';
import { VoxPopController } from './vox-pop.controller';
import { VoxPopService } from './vox-pop.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SubmissionsModule } from 'src/mongoDB/submissions/submissions.module';
import { Submission, SubmissionSchema } from 'src/mongoDB/submissions/submissions.schema';

@Module({
	imports: [SubmissionsModule, MongooseModule.forFeature([{ name: Submission.name, schema: SubmissionSchema }])],
	exports: [VoxPopService],
	controllers: [VoxPopController],
	providers: [VoxPopService],
})
export class VoxPopModule {}
