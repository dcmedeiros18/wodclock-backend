import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  /**
   * Before each test, create a testing module and get an instance of the controller
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],  // Declare the controller to be tested
      providers: [UserService],       // Provide the service used by the controller
    }).compile();

    controller = module.get<UserController>(UserController); // Retrieve controller instance
  });

  /**
   * Basic test to ensure the controller is correctly defined
   */
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
