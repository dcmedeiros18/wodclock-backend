import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordController } from './forgot-password.controller';
import { ForgotPasswordService } from './forgot-password.service';

describe('ForgotPasswordController', () => {
  let controller: ForgotPasswordController;

  const mockForgotPasswordService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    recoverPassword: jest.fn(),
    getSecretQuestion: jest.fn(),
    validateSecretAnswer: jest.fn(),
    updatePassword: jest.fn(),
  };

  /**
   * This block runs before each test to initialize the testing module
   * with the controller and its corresponding service.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForgotPasswordController], // Injects the controller
      providers: [
        {
          provide: ForgotPasswordService,
          useValue: mockForgotPasswordService,
        },
      ],
    }).compile();

    controller = module.get<ForgotPasswordController>(ForgotPasswordController); // Gets the instance
  });

  /**
   * Basic unit test to ensure the controller has been defined correctly.
   */
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
