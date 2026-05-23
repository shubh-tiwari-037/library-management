import { Injectable } from '@nestjs/common';
import { CreateRentBookDto } from './dto/create-rent-book.dto';
import { UpdateRentBookDto } from './dto/update-rent-book.dto';
import { PrismaService } from 'src/prisma';
import { BookStatus, RentalStatus } from 'src/generated/prisma/enums';

@Injectable()
export class RentBookService {
  constructor(readonly prisma:PrismaService){}

  // function for calculating dur date
  calculateDueDate(days: number): Date {
  const today = new Date();

  today.setDate(today.getDate() + days);

  return today;
}

async userHistory(userId: number) {

  const user = await this.prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const rentals = await this.prisma.rental.findMany({
    where: {
      userId,
    },

    include: {
      book: {
        select: {
          id: true,
          bookCode: true,
          title: true,
          author: true,
          category: true,
          language: true,
        },
      },
    },

    orderBy: {
      rentedAt: 'desc',
    },
  });

  return {
    message: 'User rental history fetched successfully',
    totalBooksTaken: rentals.length,
    rentals,
  };
}

  async rentBook(createRentBookDto: CreateRentBookDto,librarianId:number) {
  const { userId, bookId, dueDate} = createRentBookDto;
  const user = await this.prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error(
      'User not found',
    );
  }

  const librarian = await this.prisma.user.findUnique({
      where: {
         id:librarianId,
      },
    });

  if (!librarian) {
    throw new Error(
      'Librarian not found',
    );
  }

  const book = await this.prisma.book.findUnique({
    where: {
      id: bookId,
    },
  });

  if (!book) {
    throw new Error(
      'Book not found',
    );
  }

  if (book.availableCopies <= 0) {
    throw new Error(
      'Book not available',
    );
  }

  const alreadyRented =await this.prisma.rental.findFirst({
      where: {
        userId,
        bookId,
        status: RentalStatus.Active,
      },
    });

  if (alreadyRented) {
    throw new Error(
      'User already rented this book',
    );
  }



const finalDueDate = this.calculateDueDate(dueDate);

  const rental = await this.prisma.$transaction(
  async (tx) => {

    const createdRental = await tx.rental.create({
      data: {
        userId,
        bookId,
        librarianId,
        dueDate: finalDueDate,
      },
    });

    const updatedBook = await tx.book.update({
      where: {
        id: bookId,
      },

      data: {
        availableCopies: {
          decrement: 1,
        },
      },

      select: {
        title: true,
        totalCopies: true,
        availableCopies: true,
      },
    });

    return {
      createdRental,
      updatedBook,
    };
  },
);

return {
  message: 'Book rented successfully',

  rental: rental.createdRental,

  totalBooks: rental.updatedBook.totalCopies,

  rentedBooks:
    rental.updatedBook.totalCopies -
    rental.updatedBook.availableCopies,

  availableBooks:
    rental.updatedBook.availableCopies,
};
  }


 async allRentals() {

  const rentals =
    await this.prisma.rental.findMany({

     include: {
  rentedUser: {
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
    },
  },

  librarian: {
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
    },
  },

  book: {
    select: {
      id: true,
      title: true,
      author: true,
      category: true,
      language: true,
      bookCode: true,
    },
  },
},

      orderBy: {
        rentedAt: 'desc',
      },
    });

  return {
    message: 'All rentals fetched successfully',
    total: rentals.length,
    rentals,
  };
}

async rentalById(id: number) {

  const rental =await this.prisma.rental.findUnique({

      where: {
        id,
      },

    include: {
  rentedUser: {
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
    },
  },

  librarian: {
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
    },
  },

  book: {
    select: {
      id: true,
      title: true,
      author: true,
      category: true,
      language: true,
      bookCode: true,
    },
  },
},
    });

  if (!rental) {
    throw new Error(
      'Rental not found',
    );
  }

  return {
    message: 'Rental fetched successfully',
    rental,
  };
}


  async returnBook(updateRentBookDto: UpdateRentBookDto,id: number,) {
  const rental = await this.prisma.rental.findUnique({
    where: {
      id,
    },
  });

  if (!rental) {
    throw new Error('Rental not found');
  }

  if (rental.status === RentalStatus.Returned) {
    throw new Error('Book already returned');
  }

  const today = new Date();

  let fine = 0;

  if (today > rental.dueDate) {
    const lateDays = Math.ceil(
      (today.getTime() - rental.dueDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    fine = lateDays * 10;
  }

  const updatedRental = await this.prisma.$transaction(
    async (tx) => {

      const returnedBook = await tx.rental.update({
        where: {
          id,
        },

        data: {
          returnedAt: today,
          status: RentalStatus.Returned,
          fineAmount: fine,
        },

        include: {
          rentedUser: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
            },
          },

          librarian: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
            },
          },

          book: {
            select: {
              id: true,
              title: true,
              author: true,
              totalCopies: true,
              availableCopies: true,
            },
          },
        },
      });

      // available copies update
      const updatedBook = await tx.book.update({
        where: {
          id: rental.bookId,
        },

        data: {
          availableCopies: {
            increment: 1,
          },
        },

        select: {
          id: true,
          title: true,
          totalCopies: true,
          availableCopies: true,
        },
      });

      return {
        returnedBook,
        updatedBook,
      };
    },
  );

  return {
    message: 'Book returned successfully',
    fineAmount: fine,

    rental: updatedRental.returnedBook,

    bookStatus: {
      totalCopies: updatedRental.updatedBook.totalCopies,
      availableCopies:
        updatedRental.updatedBook.availableCopies,

      rentedCopies:
        updatedRental.updatedBook.totalCopies -
        updatedRental.updatedBook.availableCopies,
    },
  };
}


}
