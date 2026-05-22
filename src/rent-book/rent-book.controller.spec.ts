import { Test, TestingModule } from '@nestjs/testing';
import { RentBookController } from './rent-book.controller';
import { RentBookService } from './rent-book.service';

describe('RentBookController', () => {
  let controller: RentBookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentBookController],
      providers: [RentBookService],
    }).compile();

    controller = module.get<RentBookController>(RentBookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
