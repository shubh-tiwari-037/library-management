import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ParseIntPipe } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma';
import { AuthenticatedRequest, JwtAuthGuard, Roles, RolesGuard, UserType } from '@Common';
import { AllBooksDto } from './dto/get-book.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags("books")
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService,prisma:PrismaService) {}

@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(UserType.Librarian)
@ApiBearerAuth()
  @Post("create")
  create(@Query() createBookDto: CreateBookDto,@Req() req:AuthenticatedRequest) {
    const id = req.user.id
    return this.bookService.addBook(createBookDto,id);
  }

  @Get()
 findAll(@Query() query: AllBooksDto) {
    return this.bookService.allBooks(query);
  }

  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.bookService.bookById(id);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
@Roles(UserType.Librarian)
@ApiBearerAuth()
  @Patch(':id')
  update(@Param('id',ParseIntPipe) id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.updateBook(id, updateBookDto);
  }


  @UseGuards(JwtAuthGuard,RolesGuard)
@Roles(UserType.Librarian)
@ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.bookService.removeBook(id);
  }
}
