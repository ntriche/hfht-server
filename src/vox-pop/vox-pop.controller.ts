import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { VoxPopService } from './vox-pop.service';
import { LoggerService } from '../logger/logger.service';
import { voxPopDTO } from './dto/vox-pop.dto';
import { voxPop } from './interface/vox-pop.interface';
import { v4 as uuidv4 } from 'uuid';

@Controller('vox-pop')
export class VoxPopController {
  constructor(private voxPopService: VoxPopService, private log: LoggerService) {}

  @Post()
  @HttpCode(202) // 202 means accepted/received but not yet acted upon
  async controllerPost(@Body() voxPopDTO: voxPopDTO) {
    // Ensure the DTO itself isn't null/empty
    try {
      if (!!!voxPopDTO) {
        throw new HttpException("Payload is of invalid type - must be JSON", 400)
      }
      this.log.write(`Vox Pop POST request received from ${voxPopDTO.userIP}`);
    } catch(err) {
      this.log.error("Failed to create new Vox Pop - DTO is undefined.");
      console.log(err);
      return err;
    }
    // Ensure each property of the DTO isn't null/empty
    try {
      if (this.isDTOEmpty(voxPopDTO)) {
        throw new HttpException("Payload is of invalid type - one or more properties is empty", 400)
      }
    } catch(err) {
      this.log.error("Failed to create new Vox Pop - one or more parts of a Vox Pop DTO is empty");
      console.log(err);
      return err;
    }
    // Ensure the submission isn't too long or too short incase the website was bypassed and this endpoint was called directly
    try {
      let errorMessage = this.validatePost(voxPopDTO);
      if (errorMessage.length > 0) {
        throw new HttpException("Your submission has been rejected: " + errorMessage, 400);
      }
    } catch(err) {
      this.log.write("Failed to create new Vox Pop - new Vox Pop DTO failed validation");
      console.log(err);
      return err;
    }
    // Create a UUID and the new Vox Pop from the DTO
    let newPop: voxPop = null;
    try {
      const uuid = uuidv4();
      if (!!!uuid) {
        this.log.error("Failed to create new Vox Pop - failed to create UUID");
        throw new HttpException("Encountered an error - maybe try again or something", 500);
      }

      newPop = {
        userIP: voxPopDTO.userIP,
        timestamp: voxPopDTO.timestamp,
        submission: voxPopDTO.submission,
        UUID: uuid, 
      };
      if (!!!newPop) {
        throw new HttpException("Payload sucks or something I don't know bro", 400);
      }
    } catch(err) {
      this.log.error("Failed to create new Vox Pop - Vox Pop generated from DTO is false-y");
      console.log(err);
      return err;
    }
    // Finally ensure the the new Vox Pop is valid by checking if it is truthy
    if (!!newPop) {
      // TODO: write code necessary for posts to be queued and handled at some interval
      this.voxPopService.enqueuePost(newPop);
      return HttpStatus.ACCEPTED;
    }
    return new HttpException("Unspecified error", 500);
  }

  // return true if any part of the DTO is true
  // I would rather iterate over the properties of the DTO class but there doesn't seem to be a trivial way to do that
  isDTOEmpty(voxPopDTO: voxPopDTO) {
    if (!!!voxPopDTO.submission || !!!voxPopDTO.timestamp || !!!voxPopDTO.userIP) {
      return true;
    }
    return false;
  }

  validatePost(voxPopDTO: voxPopDTO): string {
    let errorString: string = "";
    if (voxPopDTO.submission.length < 1) {
      errorString += "too short (2 character minimum)";
    }

    if (voxPopDTO.submission.length > 4096) {
      errorString += "too long (4096 character maximum)";
    }

    return errorString;
  }
}