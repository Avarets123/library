-- DropForeignKey
ALTER TABLE "BookResource" DROP CONSTRAINT "BookResource_bookId_fkey";

-- AddForeignKey
ALTER TABLE "BookResource" ADD CONSTRAINT "BookResource_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
