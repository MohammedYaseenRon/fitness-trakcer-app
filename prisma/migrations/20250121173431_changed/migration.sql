/*
  Warnings:

  - You are about to drop the column `difficult` on the `Workout` table. All the data in the column will be lost.
  - Added the required column `difficulty` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "difficult",
ADD COLUMN     "difficulty" TEXT NOT NULL;