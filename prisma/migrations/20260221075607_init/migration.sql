-- AlterTable
ALTER TABLE "typing_history" ADD COLUMN     "amount" INTEGER,
ADD COLUMN     "correct_chars" INTEGER,
ADD COLUMN     "error_chars" INTEGER,
ADD COLUMN     "extra_chars" INTEGER,
ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "missed_chars" INTEGER;
