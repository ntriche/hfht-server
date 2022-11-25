import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Head } from '@nestjs/common';
import { VoxPopService } from './vox-pop.service';
import { LoggerService } from '../logger/logger.service';
import { VoxPopDTO, VoxPop } from './vox-pop.class';
import { v4 as uuidv4 } from 'uuid';

class VoxError {
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
        const error: VoxError = { msg: "Payload is of invalid type (must be JSON) or DTO is undefined", code: HttpStatus.BAD_REQUEST };
        throw error;
      }
      this.log.write(`Vox Pop POST request received from ${voxPopDTO.userIP}`);

      // Ensure the submission isn't too long or too short incase the website was bypassed and this endpoint was called directly
      const errorMessage = this.validateSubmissionLength(voxPopDTO);
      if (!!errorMessage) {
        const error: VoxError = { msg: "Submission has been rejected: " + errorMessage, code: HttpStatus.BAD_REQUEST };
        throw error;
      }

      // Create a UUID and the new Vox Pop from the DTO
      let newPop: VoxPop = null;
      const uuid = uuidv4();
      if (!!!uuid) {
        const error: VoxError = { msg: "Failed to create new Vox Pop - failed to create UUID", code: HttpStatus.INTERNAL_SERVER_ERROR };
        throw error;
      }
      
      newPop = new VoxPop(voxPopDTO, uuid);
      if (!!!newPop) {
        const error: VoxError = { msg: "Payload sucks or something I don't know bro", code: HttpStatus.BAD_REQUEST };
        throw error;
      }

      // Finally ensure the the new Vox Pop is valid by checking if it is truthy
      if (!!newPop) {
        newPop.timestampAtSubmission = new Date();

        // TODO: write code necessary for posts to be queued and handled at some interval
        this.voxPopService.enqueuePost(newPop);

        return "Thank you for your submission!";
      }
    } catch (error) {
      if (error instanceof VoxError) {
        console.log(error);
        throw new HttpException(error.msg, error.code);
      }
    }

    throw new HttpException("Unspecified error", 500);
  }

  validateSubmissionLength(dto: VoxPopDTO): string {
    if (dto.submission.length < 1) {
      return "most recent submission is too short (2 character minimum)";
    }

    if (dto.submission.length > 4096) {
      return "most recent submission is too long (4096 character maximum)";
    }

    return "";
  }
}