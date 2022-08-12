import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { VoxPopService } from './vox-pop.service';
import { LoggerService } from '../logger/logger.service';
import { voxPopDTO } from './dto/vox-pop.dto';

@Controller('vox-pop')
export class VoxPopController {
  constructor(private voxPopService: VoxPopService, private log: LoggerService) {}

  @Get()
  async getFunc(): Promise<string> {
    this.log.write('Vox Pop GET request received');
    return 'this is a get test'
  }

  @Post()
  @HttpCode(202) // 202 means accepted/received but not yet acted upon
  async enqueuePost(@Body() voxPopDTO: voxPopDTO) {
    if (!!!voxPopDTO) {
      this.log.write(`New Vox Pop Post request is undefined.`);
      throw new HttpException(`payload is of invalid type/must be JSON`, 400)
    }

    this.log.write(`Vox Pop POST request received: ${JSON.stringify(voxPopDTO)}`);
    // we do not need to queue stuff right now
    // TODO: create all the necessary shit to have this queue work
    // const count = this.voxPopService.enqueue(voxPopDTO);
    // this.log.write(`Message enqueued, current messages in queue: ${count}`);

    // post directly to the blog instead
    this.voxPopService.post(voxPopDTO)
  }
}