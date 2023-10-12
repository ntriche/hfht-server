import { Injectable } from '@nestjs/common';
import { SubmissionsService } from 'src/submissions/submissions.service';
import { HfhtLoggerService } from '../logger/hfht.logger.service';
import { Submission } from 'src/submissions/submissions.schema';
import { VoxPopDTO } from './dto/vox-pop.dto';

@Injectable()
export class VoxPopService {
	constructor(
		private readonly submissionsService: SubmissionsService, 
		private logger: HfhtLoggerService,
	) {
		this.logger.setContext(VoxPopService.name)
	}

	process(voxPopDTO: VoxPopDTO, ip: string): void {
		voxPopDTO.submission = this.removeHTMLTags(voxPopDTO.submission);
		this.logger.log(`Received new submission from ${ip}`)
		this.submissionsService.create(new Submission(voxPopDTO, ip));
	}

	removeHTMLTags(sub: string): string {
		return sub.replaceAll(new RegExp(/<.+?>/gm), '');
	}
}
