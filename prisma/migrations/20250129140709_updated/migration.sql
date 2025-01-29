/*
  Warnings:

  - You are about to drop the `Equipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FitnessActivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FitnessActivity" DROP CONSTRAINT "FitnessActivity_userId_fkey";

-- AlterTable
ALTER TABLE "Exercise" ALTER COLUMN "duration" SET DEFAULT '00:00';

-- DropTable
DROP TABLE "Equipment";

-- DropTable
DROP TABLE "FitnessActivity";
