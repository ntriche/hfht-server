import { Controller, Get } from '@nestjs/common';
import { Submission } from './submissions.schema';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
	constructor(private readonly submissionsService: SubmissionsService) {}
	
	@Get()
	async getSubmissions(): Promise<Submission[]> {
		return this.submissionsService.find({});
	}
}
