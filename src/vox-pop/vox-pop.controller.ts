import { Body, Controller, HttpCode, Ip, Post, UseGuards } from '@nestjs/common';
import { VoxPopService } from './vox-pop.service';
import { VoxPopDTO } from './dto/vox-pop.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('vox-pop')
@UseGuards(ThrottlerGuard)
export class VoxPopController {
	constructor(
		private voxPopService: VoxPopService
	) {}

	@Post()
	@HttpCode(202)
	async process(@Body() voxPopDTO: VoxPopDTO, @Ip() ip: string) {
		this.voxPopService.process(voxPopDTO, ip);
	}
}
