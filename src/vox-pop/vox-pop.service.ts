import { Injectable } from '@nestjs/common';
import { SubmissionsService } from 'src/submissions/submissions.service';
import { LoggerService } from '../logger/logger.service';
import { Submission } from 'src/submissions/submissions.schema';
import { VoxPopDTO } from './vox-pop.dto';

@Injectable()
export class VoxPopService {
	constructor(
		private readonly submissionsService: SubmissionsService, 
		private readonly log: LoggerService,
		) {}

	process(voxPopDTO: VoxPopDTO, ip: string): void {
		voxPopDTO.submission = this.removeHTMLTags(voxPopDTO.submission);
		this.log.info(`Creating a new submission with content ${voxPopDTO.submission.slice(0, 16)}`)
		this.submissionsService.create(new Submission(voxPopDTO, ip));
	}

	removeHTMLTags(sub: string): string {
		return sub.replaceAll(new RegExp(/<.+?>/gm), '');
	}
}
