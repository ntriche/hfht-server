import { Controller, Get, Body, UseGuards, Put, Delete, Post, Query, UseInterceptors, Patch, Param, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { SubmissionDTO } from 'src/submissions/dto/submission.dto';
import { DeleteManyDTO } from 'src/submissions/dto/deleteMany.dto';
import { SubmissionResponse, SubmissionsService } from './submissions.service';
import { ReviewStatus } from './submission.enums';
import { ReviewDTO } from './dto/review.dto';
import { SubmissionsInterceptor } from './submissions.interceptor';

@Controller('submissions')
@UseGuards(JwtAuthGuard)
@UseInterceptors(SubmissionsInterceptor)
export class SubmissionsController {
	constructor(private readonly submissionsService: SubmissionsService) {}

	@Post()
	async create(@Body() submissionDTO: SubmissionDTO): Promise<SubmissionDTO> {
		return await this.submissionsService.create(submissionDTO);
	}

	@Get()
	async test(@Query() query: object) {
		console.log((query));
		// for (const q in query) {
		// 	if (!(q in SubmissionDTO)) {
		// 		console.log(q);
		// 		throw new HttpException(`Invalid param ${q}`, HttpStatus.BAD_REQUEST);
		// 	}
		// }
		return this.submissionsService.findOne(query);
	}

	@Get()
	async findOne(@Query('uuid') uuid: string) {
		return this.submissionsService.findOne({'UUID': uuid})
	}

	@Get()
	async findMany(@Query('type') type: string) {
		return this.submissionsService.getSubmissions(ReviewStatus[type]);
	}

	@Patch()
	async updateOne(@Query('uuid') uuid: string, @Body() reviewDTO: ReviewDTO): Promise<SubmissionResponse> {
		return this.submissionsService.updateOne(uuid, reviewDTO);
	}

	@Put()
	async updateMany(@Body() reviewDTO: ReviewDTO[]): Promise<SubmissionResponse> {
		return this.submissionsService.updateMany(reviewDTO);
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
	