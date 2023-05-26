import { Controller, Get, Post, HttpStatus, HttpException, Body } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { LoggerService } from 'src/logger/logger.service';
import { SubmissionDTO } from 'src/mongoDB/submissions/submissions.schema';

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
	async handleReviewedSubmissions(@Body() submissions: SubmissionDTO[]): Promise<string> {
		if (!!!submissions) {
			this.log.error('Received invalid POST request to handle reviewed submissions.');
			throw new HttpException('Reviewed submissions are undefined, null, or generally fucked up', HttpStatus.BAD_REQUEST);
		}

		try {
			return this.dashboardService.handleReviewedSubmissions(submissions);
		} catch(error) {
			if (error instanceof HttpException) {
				this.log.error('Received invalid POST request to handle reviewed submissions.');
				throw error;
			}
		}
	}
}
	