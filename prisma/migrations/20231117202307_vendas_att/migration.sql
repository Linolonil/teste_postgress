-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "trip" BOOLEAN,
ALTER COLUMN "delivery" DROP NOT NULL;
