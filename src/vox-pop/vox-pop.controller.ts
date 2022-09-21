import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { VoxPopService } from './vox-pop.service';
import { LoggerService } from '../logger/logger.service';
import { voxPopDTO } from './dto/vox-pop.dto';

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
    // TODO: write code necessary for posts to be queued and handled at some interval

    // post directly to the blog for now
    this.voxPopService.createTumblrPost(voxPopDTO);

    return 'Submission received!';
  }
}