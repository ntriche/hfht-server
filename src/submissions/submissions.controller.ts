import { Controller, Get, Body, UseGuards, Put, Delete, Post, Query, HttpStatus, HttpException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { SubmissionDTO } from 'src/submissions/dto/submission.dto';
import { DeleteManyDTO } from 'src/submissions/dto/deleteMany.dto';
import { SubmissionResponse, SubmissionsService } from './submissions.service';
import { ReviewStatus } from './submission.enums';

@Controller('submissions')
@UseGuards(JwtAuthGuard)
export class SubmissionsController {
	constructor(
		private readonly submissionsService: SubmissionsService
	) {}

	@Post()
	async create(@Body() submissionDTO: SubmissionDTO): Promise<SubmissionDTO> {
		return await this.submissionsService.create(submissionDTO);
	}

	@Get()
	async find(@Query('uuid') uuid: string, @Query('type') type: string) {
		if (uuid) { return this.submissionsService.findOne({'UUID': uuid}); }
		if (type) { return this.submissionsService.getSubmissions(ReviewStatus[type]); }
		throw new HttpException('give me a query string bro', HttpStatus.BAD_REQUEST);
	}

	@Put()
	async submitReview(@Body() submissionsDTO: SubmissionDTO[]): Promise<SubmissionResponse> {
		return this.submissionsService.handleReview(submissionsDTO);
	}

	@Post('delete')
	async deleteMany(@Body() deleteManyDTO: DeleteManyDTO[]): Promise<string> {
		return this.submissionsService.deleteMany({deleteManyDTO});
	}

	@Delete('delete')
	async deleteOne(@Query('uuid') uuid: string): Promise<string> {
		return this.submissionsService.deleteOne(uuid);
	}
}
	