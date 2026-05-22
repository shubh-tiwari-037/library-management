import { Module } from '@nestjs/common';
import { RentBookService } from './rent-book.service';
import { RentBookController } from './rent-book.controller';
import { PrismaModule } from 'src/prisma';

@Module({
  imports:[PrismaModule],
  controllers: [RentBookController],
  providers: [RentBookService],
})
export class RentBookModule {}
