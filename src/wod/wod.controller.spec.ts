import { Test, TestingModule } from '@nestjs/testing';
import { WodController } from './wod.controller';
import { WodService } from './wod.service';

describe('WodController', () => {
  let controller: WodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WodController],
      providers: [WodService],
    }).compile();

    controller = module.get<WodController>(WodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
