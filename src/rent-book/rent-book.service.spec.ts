import { Test, TestingModule } from '@nestjs/testing';
import { RentBookService } from './rent-book.service';

describe('RentBookService', () => {
  let service: RentBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentBookService],
    }).compile();

    service = module.get<RentBookService>(RentBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
