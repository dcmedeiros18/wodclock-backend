import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';

describe('BookController', () => {
  let controller: BookController;

  const mockBookService = {
    book: jest.fn(),
    getUserFrequency: jest.fn(),
    findByUserId: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  // This hook runs before each test
  beforeEach(async () => {
    // Create a testing module that includes the BookController and its service
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],  // Register the controller under test
      providers: [
        {
          provide: BookService,
          useValue: mockBookService,
        },
      ],
    }).compile();                     // Compile the module

    // Retrieve an instance of BookController from the testing module
    controller = module.get<BookController>(BookController);
  });

  // Test: checks if the controller is properly defined and instantiated
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
