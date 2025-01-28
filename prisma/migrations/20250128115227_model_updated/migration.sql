/*
  Warnings:

  - You are about to drop the column `discout` on the `Equipment` table. All the data in the column will be lost.
  - The `weight` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `calories` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `exercise` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `reps` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `sets` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Workout` table. All the data in the column will be lost.
  - Added the required column `discount` to the `Equipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Equipment" DROP COLUMN "discout",
ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "weight",
ADD COLUMN     "weight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "calories",
DROP COLUMN "exercise",
DROP COLUMN "reps",
DROP COLUMN "sets",
DROP COLUMN "weight";

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sets" INTEGER,
    "reps" INTEGER,
    "weight" DOUBLE PRECISION,
    "calories" DOUBLE PRECISION,
    "workoutId" INTEGER NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
