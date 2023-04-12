import { Controller, Get } from '@nestjs/common';
import { RejectionsService } from './rejections.service';
import { Rejection } from './rejections.schema';

@Controller('rejections')
export class RejectionsController {
	constructor(private readonly rejectionsService: RejectionsService) {}
	
	@Get()
	async getRejections(): Promise<Rejection[]> {
		return this.rejectionsService.find({});
	}
}
