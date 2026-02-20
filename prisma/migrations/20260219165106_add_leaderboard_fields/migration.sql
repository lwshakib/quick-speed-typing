-- AlterTable
ALTER TABLE "typing_history" ADD COLUMN     "consistency" INTEGER,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "mode" TEXT,
ADD COLUMN     "raw_wpm" INTEGER;
