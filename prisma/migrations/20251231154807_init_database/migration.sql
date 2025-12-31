-- AlterTable
ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT 8;

-- CreateTable
CREATE TABLE "Motion" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "fbxUrl" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Motion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Motion_userId_idx" ON "Motion"("userId");

-- AddForeignKey
ALTER TABLE "Motion" ADD CONSTRAINT "Motion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
