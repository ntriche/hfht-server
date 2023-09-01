import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { SubmissionDTO } from 'src/mongoDB/submissions/submissions.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
	constructor(private dashboardService: DashboardService) {}

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
	