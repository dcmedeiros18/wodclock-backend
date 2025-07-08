import { Test, TestingModule } from '@nestjs/testing';
import { WodService } from './wod.service';

describe('WodService', () => {
  let service: WodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WodService],
    }).compile();

    service = module.get<WodService>(WodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
