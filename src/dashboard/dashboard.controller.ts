import { Controller, Get, Post } from '@nestjs/common';
import { DashboardService, ReviewedSubmissionDTO } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
	constructor(private dashboardService: DashboardService) {}

	@Get('enqueue')
	getEnqueuedSubmissions(): string {
		return this.dashboardService.getEnqueuedSubmissions();
	}

	@Post()
	handleReviewedSubmissions(submissions: ReviewedSubmissionDTO[]): string {
		return this.dashboardService.handleReviewedSubmissions(submissions);
	}
}
