import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma';
import { AllBooksDto } from './dto/get-book.dto';

@Injectable()
export class BookService {
  constructor(readonly prisma: PrismaService) {}

  async addBook(createBookDto: CreateBookDto, id: number) {
    const existingBook = await this.prisma.book.findUnique({
      where: {
        bookCode: createBookDto.bookCode,
      },
    });

    if (existingBook) {
      throw new Error('Book with this id already exists');
    }

    const book = await this.prisma.book.create({
      data: {
        title: createBookDto.title,
        author: createBookDto.author,
        description: createBookDto.description,
        librarianId: id,
        totalCopies: createBookDto.totalCopies,
        availableCopies: createBookDto.totalCopies,
        category: createBookDto.category,
        language: createBookDto.language,
        publishedYear: createBookDto.publishedYear,
        bookCode: createBookDto.bookCode,
        shelfNumber: createBookDto.shelfNumber,
      },
    });

    return {
      message: 'Book created successfully',
      data: book,
    };
  }

  async allBooks(query: AllBooksDto) {
    const { page = 1, limit = 10, search, category, language, status } = query;

    const skip = (page - 1) * limit;

    const books = await this.prisma.book.findMany({
      where: {
        OR: search
          ? [
              {
                title: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                author: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ]
          : undefined,

        category,
        language,
        status,
      },

      skip,
      take: limit,

      include: {
        librarian: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      message: 'Books fetched successfully',
      data: books,
    };
  }

  async bookById(id: number) {
    const book = await this.prisma.book.findUnique({
      where: {
        id,
      },

      include: {
        librarian: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });

    if (!book) {
      throw new Error('Book not found');
    }

    return {
      message: 'Book fetched successfully',
      data: book,
    };
  }

  async updateBook(id: number, updateBookDto: UpdateBookDto) {
    const existingBook = await this.prisma.book.findUnique({
      where: {
        id,
      },
    });

    if (!existingBook) {
      throw new Error('Book not found');
    }

    if (updateBookDto.totalCopies && updateBookDto.totalCopies < 1) {
      throw new Error('Total copies must be greater than 0');
    }

    let availableCopies = existingBook.availableCopies;

    if (updateBookDto.totalCopies) {
      const rentedBooks =
        existingBook.totalCopies - existingBook.availableCopies;

      availableCopies = updateBookDto.totalCopies - rentedBooks;
    }

    const updatedBook = await this.prisma.book.update({
      where: {
        id,
      },

      data: {
        ...updateBookDto,
        availableCopies,
      },
    });

    return {
      message: 'Book updated successfully',
      data: updatedBook,
    };
  }

  async removeBook(id: number) {
    const book = await this.prisma.book.findFirst({
      where: {
        id,
      },
    });

    if (!book) return 'book is not found on this id';

    const deletedbook = this.prisma.book.delete({
      where: {
        id,
      },
    });

    return {
      message: 'book deledt successfully',
      deletedbook: deletedbook,
    };
  }
}
