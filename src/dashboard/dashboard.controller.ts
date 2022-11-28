import { Controller, Get, Post } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
	constructor(private dashboardService: DashboardService) {}

	@Get() // Returns all enqueued posts
	getPosts(): string {
		return this.dashboardService.getPosts();
	}

	@Post() // Creates Tumblr posts
	createPost(): string {
		return 'lol lmao';
	}
}
