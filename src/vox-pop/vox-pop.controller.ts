import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { VoxPopService } from './vox-pop.service';
import { LoggerService } from '../logger/logger.service';
import { VoxPop } from './vox-pop.class';
import { VoxPopDTO } from './vox-pop.dto';

@Controller('vox-pop')
export class VoxPopController {
	constructor(private voxPopService: VoxPopService, private log: LoggerService) {}

	@Post()
	@HttpCode(202) // 202 means accepted/received but not yet acted upon
	async controllerPost(@Body() voxPopDTO: VoxPopDTO) {
		if (!voxPopDTO || !voxPopDTO.submission) {
			this.log.info(`Rejected an invalid submission`);
			throw new HttpException("Payload is of invalid type (must be JSON) or DTO is undefined", HttpStatus.BAD_REQUEST)
		}
		
		let trace = ''
		if (this.voxPopService.validateIPv4(voxPopDTO.userIP)) {
			trace += `New Vox Pop submission received from ${voxPopDTO.userIP} - `;
		} else {
			trace += "New Vox Pop submission received with an invalid or non-IPv4 user IP - ";
		}

		const msg = this.voxPopService.validateSubmissionLength(voxPopDTO.submission);
		if (msg) {
			this.log.info(trace + "Rejecting new submission because it has an invalid length"); 
			throw new HttpException("Submission has been rejected: " + msg, HttpStatus.BAD_REQUEST)
		}

		const newPop = new VoxPop(voxPopDTO);
		if (newPop) {
			this.voxPopService.processNewVoxPop(newPop, trace);
			return "Thank you for your submission!";
		} else {
			throw new HttpException("Payload sucks or something I don't know bro", HttpStatus.BAD_REQUEST);
		}
	}
}
