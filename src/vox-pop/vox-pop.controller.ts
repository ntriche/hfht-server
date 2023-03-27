import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Head } from '@nestjs/common';
import { VoxPopService } from './vox-pop.service';
import { LoggerService } from '../logger/logger.service';
import { VoxPopDTO, VoxPop } from './vox-pop.class';
import { v4 as uuidv4 } from 'uuid';

class VoxError {
	constructor(_msg: string, _code: HttpStatus) {
		this.msg = _msg;
		this.code = _code;
	}

	msg: string;
	code: HttpStatus;
}

@Controller('vox-pop')
export class VoxPopController {
	constructor(private voxPopService: VoxPopService, private log: LoggerService) {}

	@Post()
	@HttpCode(202) // 202 means accepted/received but not yet acted upon
	async controllerPost(@Body() voxPopDTO: VoxPopDTO) {
		// Ensure the DTO itself isn't null/empty
		try {
			if (!!!voxPopDTO || !!!voxPopDTO.submission || !!!voxPopDTO.userIP) {
				this.log.write(`Invalid submission received from ${voxPopDTO.userIP}`);
				throw new VoxError("Payload is of invalid type (must be JSON) or DTO is undefined", HttpStatus.BAD_REQUEST)
			}
			this.log.write(`Vox Pop POST request received from ${voxPopDTO.userIP}`);

			// Ensure the submission isn't too long or too short incase the website was bypassed and this endpoint was called directly
			const errorMessage = this.validateSubmissionLength(voxPopDTO);
			if (!!errorMessage) {
				throw new VoxError("Submission has been rejected: " + errorMessage, HttpStatus.BAD_REQUEST)
			}

			// Construct a VoxPop object from the DTO & ensure it is valid
			let newPop = new VoxPop(voxPopDTO);
			if (!!newPop) {
				// TODO: write code necessary for posts to be queued and handled at some interval or just use Tumblr's use system
				this.voxPopService.enqueuePost(newPop);

				return "Thank you for your submission!";
			} else {
				throw new VoxError("Payload sucks or something I don't know bro", HttpStatus.BAD_REQUEST);
			}
		} catch (error) {
			if (error instanceof VoxError) {
				console.log(error);
			} else {
				console.log(`Non-Vox Error caught: ` + error);
			}
			throw new HttpException(error.msg, error.code);
		}
	}

	validateSubmissionLength(dto: VoxPopDTO): string {
		let error: string = ''
		if (dto.submission.length < 1) {
			error = 'most recent submission is too short (2 character minimum)';
		} else if (dto.submission.length > 4096) {
			error = 'most recent submission is too long (4096 character maximum)';
		}
		return error;
	}
}
