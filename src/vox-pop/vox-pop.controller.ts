import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { VoxPopService } from './vox-pop.service';
import { LoggerService } from '../logger/logger.service';
import { voxPopDTO } from './dto/vox-pop.dto';
import { voxPop } from './interface/vox-pop.interface';
import { v4 as uuidv4 } from 'uuid';

@Controller('vox-pop')
export class VoxPopController {
  constructor(private voxPopService: VoxPopService, private log: LoggerService) {}

  @Get()
  async controllerGet(): Promise<string> {
    this.log.write('Vox Pop GET request received');
    return 'this is a get test'
  }

  @Post()
  @HttpCode(202) // 202 means accepted/received but not yet acted upon
  async controllerPost(@Body() voxPopDTO: voxPopDTO) {
    if (!!!voxPopDTO) {
      this.log.write(`New Vox Pop Post request is undefined.`);
      throw new HttpException(`payload is of invalid type/must be JSON`, 400)
    }
    this.log.write(`Vox Pop POST request received: ${JSON.stringify(voxPopDTO)}`);

    try {
      const uuid = uuidv4();
      if (!!!uuid) {
        throw "UUID is false-y";
      }

      const newPop: voxPop = {
        userIP: voxPopDTO.userIP,
        timestamp: voxPopDTO.timestamp,
        submission: voxPopDTO.submission,
        UUID: uuid, 
      };
      if (!!!newPop) {
        throw "Vox Pop generated from DTO is false-y";
      }
  
      // TODO: write code necessary for posts to be queued and handled at some interval
      // post directly to the blog for now
      this.voxPopService.createTumblrPost(newPop)
      return 'Submission received!';
    } catch(err) {
      console.log(err);
      return err;
    }
  }
}