-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('available', 'rented', 'lost', 'maintenance');

-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('active', 'returned', 'overdue');

-- CreateEnum
CREATE TYPE "BookCategory" AS ENUM ('fiction', 'science', 'history', 'technology', 'biography');

-- CreateEnum
CREATE TYPE "BookLanguage" AS ENUM ('english', 'hindi', 'marathi', 'tamil', 'telugu');

-- CreateTable
CREATE TABLE "books" (
    "id" SERIAL NOT NULL,
    "book_title" TEXT NOT NULL,
    "librarian_id" INTEGER NOT NULL,
    "description" TEXT,
    "author" TEXT NOT NULL,
    "published_year" INTEGER,
    "category" "BookCategory" NOT NULL,
    "book_language" "BookLanguage" NOT NULL,
    "total_book_copies" INTEGER NOT NULL,
    "availableCopies" INTEGER NOT NULL DEFAULT 0,
    "shelfNumber" INTEGER NOT NULL,
    "status" "BookStatus" NOT NULL DEFAULT 'available',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rental" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "book_id" INTEGER NOT NULL,
    "issued_by_id" INTEGER NOT NULL,
    "rented_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3) NOT NULL,
    "returned_at" TIMESTAMP(3),
    "status" "RentalStatus" NOT NULL DEFAULT 'active',
    "fine_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rental_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_librarian_id_fkey" FOREIGN KEY ("librarian_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_issued_by_id_fkey" FOREIGN KEY ("issued_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
