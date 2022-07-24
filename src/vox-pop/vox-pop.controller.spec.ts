import { Test, TestingModule } from '@nestjs/testing';
import { VoxPopController } from './vox-pop.controller';

describe('VoxPopController', () => {
  let controller: VoxPopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoxPopController],
    }).compile();

    controller = module.get<VoxPopController>(VoxPopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
