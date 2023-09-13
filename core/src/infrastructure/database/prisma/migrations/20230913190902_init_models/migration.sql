-- CreateEnum
CREATE TYPE "UserRolesEnum" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "role" "UserRolesEnum" NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "book" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "redaction" TEXT NOT NULL,
    "publishedDate" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "genre" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "book_genre_pivot_table" (
    "genreId" UUID NOT NULL,
    "bookId" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "user_book_pivot_table" (
    "userId" UUID NOT NULL,
    "bookId" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "book_id_key" ON "book"("id");

-- CreateIndex
CREATE UNIQUE INDEX "book_name_key" ON "book"("name");

-- CreateIndex
CREATE UNIQUE INDEX "genre_id_key" ON "genre"("id");

-- CreateIndex
CREATE UNIQUE INDEX "genre_name_key" ON "genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "book_genre_pivot_table_genreId_bookId_key" ON "book_genre_pivot_table"("genreId", "bookId");

-- CreateIndex
CREATE UNIQUE INDEX "user_book_pivot_table_userId_bookId_key" ON "user_book_pivot_table"("userId", "bookId");

-- AddForeignKey
ALTER TABLE "book_genre_pivot_table" ADD CONSTRAINT "book_genre_pivot_table_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_genre_pivot_table" ADD CONSTRAINT "book_genre_pivot_table_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_book_pivot_table" ADD CONSTRAINT "user_book_pivot_table_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_book_pivot_table" ADD CONSTRAINT "user_book_pivot_table_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
