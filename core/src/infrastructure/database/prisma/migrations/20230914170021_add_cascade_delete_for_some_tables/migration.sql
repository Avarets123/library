-- DropForeignKey
ALTER TABLE "book_genre_pivot_table" DROP CONSTRAINT "book_genre_pivot_table_bookId_fkey";

-- DropForeignKey
ALTER TABLE "book_genre_pivot_table" DROP CONSTRAINT "book_genre_pivot_table_genreId_fkey";

-- DropForeignKey
ALTER TABLE "user_book_pivot_table" DROP CONSTRAINT "user_book_pivot_table_bookId_fkey";

-- DropForeignKey
ALTER TABLE "user_book_pivot_table" DROP CONSTRAINT "user_book_pivot_table_userId_fkey";

-- AddForeignKey
ALTER TABLE "book_genre_pivot_table" ADD CONSTRAINT "book_genre_pivot_table_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_genre_pivot_table" ADD CONSTRAINT "book_genre_pivot_table_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_book_pivot_table" ADD CONSTRAINT "user_book_pivot_table_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_book_pivot_table" ADD CONSTRAINT "user_book_pivot_table_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
