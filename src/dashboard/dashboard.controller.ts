import { Controller, Get, Post, HttpStatus, HttpException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { LoggerService } from 'src/logger/logger.service';
import { Submission } from 'src/mongoDB/submissions/submissions.schema';

@Controller('dashboard')
export class DashboardController {
	constructor(private dashboardService: DashboardService, private log: LoggerService) {}

	@Get('enqueue')
	getEnqueuedSubmissions(): string {
		return this.dashboardService.getEnqueuedSubmissions();
	}

	@Get('unreviewed')
	async getUnreviewedSubmissions(): Promise<string> {
		return this.dashboardService.getUnreviewedSubmissions();
	}

	@Post('submit-review')
	async handleReviewedSubmissions(submissions: Submission[]): Promise<string> {
		if (!!!submissions) {
			this.log.error('Received invalid POST request to handle reviewed submissions.');
			throw new HttpException('Reviewed submissions are undefined, null, or generally fucked up', HttpStatus.BAD_REQUEST);
		}

		return this.dashboardService.handleReviewedSubmissions(submissions);
	}

	@Post('test')
	test(s: string): string {
		if (!!!s) {
			console.log('looks like ass');
			return 'ass'
		}
		console.log('looks good right?')
	}
}
	