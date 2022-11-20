import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { VoxPopService } from './vox-pop.service';
import { LoggerService } from '../logger/logger.service';
import { VoxPopDTO, VoxPop } from './vox-pop.class';
import { v4 as uuidv4 } from 'uuid';

@Controller('vox-pop')
export class VoxPopController {
  constructor(private voxPopService: VoxPopService, private log: LoggerService) {}

  @Post()
  // @HttpCode(202) // 202 means accepted/received but not yet acted upon
  async controllerPost(@Body() voxPopDTO: VoxPopDTO) {
    // Ensure the DTO itself isn't null/empty
    try {
      if (!!!voxPopDTO || !!!voxPopDTO.submission || !!!voxPopDTO.userIP) {
        throw new HttpException("Payload is of invalid type (must be JSON) or DTO is undefined", 400)
      }
    } catch(err) {
      console.log("Failed to process Vox Pop DTO\n", err);
      return err;
    }
    this.log.write(`Vox Pop POST request received from ${voxPopDTO.userIP}`);

    // Ensure the submission isn't too long or too short incase the website was bypassed and this endpoint was called directly
    try {
      const errorMessage = this.validateSubmissionLength(voxPopDTO);
      if (!!errorMessage) {
        throw new HttpException("Submission has been rejected: " + errorMessage, 400);
      }
    } catch(err) {
      console.log("Failed to validate Vox Pop DTO submission\n", err);
      return err;
    }

    // Create a UUID and the new Vox Pop from the DTO
    let newPop: VoxPop = null;
    try {
      const uuid = uuidv4();
      if (!!!uuid) {
        throw new HttpException("Failed to create new Vox Pop - failed to create UUID", 500);
      }
      
      newPop = new VoxPop(voxPopDTO, uuid);
      if (!!!newPop) {
        throw new HttpException("Payload sucks or something I don't know bro", 400);
      }
    } catch(err) {
      console.log("Failed to process create Vox Pop from DTO\n", err);
      return err;
    }

    // Finally ensure the the new Vox Pop is valid by checking if it is truthy
    if (!!newPop) {
      newPop.timestampAtSubmission = new Date();

      // TODO: write code necessary for posts to be queued and handled at some interval
      this.voxPopService.enqueuePost(newPop);

      return HttpStatus.ACCEPTED;
    }
    return new HttpException("Unspecified error", 500);
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