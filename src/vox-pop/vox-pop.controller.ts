import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Head } from '@nestjs/common';
import { VoxPopService } from './vox-pop.service';
import { LoggerService } from '../logger/logger.service';
import { VoxPopDTO, VoxPop } from './vox-pop.class';

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
			
			if (this.validateIPv4(voxPopDTO.userIP)) {
				this.log.write(`New Vox Pop submission received from ${voxPopDTO.userIP}`);
			} else {
				this.log.write("New Vox Pop submission received with an invalid or non-IPv4 user IP.");
			}

			// Ensure the submission isn't falsy, too long, or too short incase the website was bypassed and this endpoint was called directly
			const msg = this.validateSubmission(voxPopDTO.submission);
			if (!!msg) {
				throw new VoxError("Submission has been rejected: " + msg, HttpStatus.BAD_REQUEST)
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
			// I believe this 'throw' here is what the client receives
			throw new HttpException(error.msg, error.code);
		}
	}

	// TODO: If I care about IP addresses, this regex needs work. This regular expression will give false positives.
	private ipv4_regex: RegExp = /[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/;
	public validateIPv4(userIP: string): boolean {
		return this.ipv4_regex.test(userIP);
	}

	public validateSubmission(submission: string): string {
		if (!!!submission) 			   { return "submission text is invalid (empty or null)"; 		}
		if (submission.length < 1) 	   { return "submission is too short (2 character minimum)"; 	}
		if (submission.length > 4096)  { return "submission is too long (4096 character maximum)"; }
		return "";
	}
}
