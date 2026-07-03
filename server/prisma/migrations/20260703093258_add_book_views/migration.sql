-- CreateTable
CREATE TABLE "book_views" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "userId" TEXT,
    "guestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "book_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "book_views_bookId_userId_key" ON "book_views"("bookId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "book_views_bookId_guestId_key" ON "book_views"("bookId", "guestId");

-- AddForeignKey
ALTER TABLE "book_views" ADD CONSTRAINT "book_views_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
