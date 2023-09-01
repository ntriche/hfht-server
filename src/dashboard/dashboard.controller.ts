import { Controller, Get, Post, HttpStatus, HttpException, Body } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { LoggerService } from 'src/logger/logger.service';
import { SubmissionDTO } from 'src/mongoDB/submissions/submissions.schema';

@Controller('dashboard')
export class DashboardController {
	constructor(private dashboardService: DashboardService, private log: LoggerService) {}

	@Get('enqueue')
	enqueue(): string {
		return this.dashboardService.getEnqueuedSubmissions();
	}

	@Get('unreviewed')
	async unreviewed(): Promise<string> {
		return this.dashboardService.getUnreviewedSubmissions();
	}

	@Post('submit-review')
	async submitReview(@Body() submissions: SubmissionDTO[]): Promise<string> {
		return this.dashboardService.handleReviewedSubmissions(submissions);
	}
}
	