import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RentBookService } from './rent-book.service';
import { CreateRentBookDto } from './dto/create-rent-book.dto';
import { UpdateRentBookDto } from './dto/update-rent-book.dto';
import {
  AuthenticatedRequest,
  JwtAuthGuard,
  Roles,
  RolesGuard,
  UserType,
} from '@Common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('rented_user_books')
@Controller('rent-book')
export class RentBookController {
  constructor(private readonly rentBookService: RentBookService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.Librarian)
  @ApiBearerAuth()
  @Post()
  rentBook(
    @Body() createRentalDto: CreateRentBookDto,
    @Req() req: AuthenticatedRequest,
  ) {
    console.log(req.user);
    const librarianId = req.user.id;

    return this.rentBookService.rentBook(createRentalDto, librarianId);
  }

  @UseGuards(JwtAuthGuard,)
    @ApiBearerAuth()
  @Get("history")
  userHistory( @Req() req: AuthenticatedRequest,){
    const userId= req.user.id
    return this.rentBookService.userHistory(userId)
  }

  @Get()
  allRentals() {
    return this.rentBookService.allRentals();
  }

  @Get(':id')
  rentalById(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.rentBookService.rentalById(id);
  }

  @Roles(UserType.Librarian)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('return/:id')
  @ApiBearerAuth()
  returnBook(
    @Param('id', ParseIntPipe) id: number,
    @Param() updateRentBookDto: UpdateRentBookDto,
  ) {
    return this.rentBookService.returnBook(updateRentBookDto, id);
  }
}
