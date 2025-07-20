import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordController } from './forgot-password.controller';
import { ForgotPasswordService } from './forgot-password.service';

describe('ForgotPasswordController', () => {
  let controller: ForgotPasswordController;

  /**
   * This block runs before each test to initialize the testing module
   * with the controller and its corresponding service.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForgotPasswordController], // Injects the controller
      providers: [ForgotPasswordService],      // Injects the service used by the controller
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
