-- CreateEnum
CREATE TYPE "UserDeckStatus" AS ENUM ('active', 'archived');

-- AlterTable
ALTER TABLE "UserDeck" ADD COLUMN     "status" "UserDeckStatus" NOT NULL DEFAULT 'active';
