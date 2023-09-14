-- CreateTable
CREATE TABLE "BookResource" (
    "id" UUID NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "bookId" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BookResource_id_key" ON "BookResource"("id");

-- AddForeignKey
ALTER TABLE "BookResource" ADD CONSTRAINT "BookResource_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
