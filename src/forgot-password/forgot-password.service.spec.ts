import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForgotPasswordService } from './forgot-password.service';
import { User } from '../user/entities/user.entity';

describe('ForgotPasswordService', () => {
  let service: ForgotPasswordService;

  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForgotPasswordService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ForgotPasswordService>(ForgotPasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
