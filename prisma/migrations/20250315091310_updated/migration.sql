-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hydrationLevel" INTEGER,
ADD COLUMN     "injuryHistory" TEXT,
ADD COLUMN     "mobilityIssues" TEXT,
ADD COLUMN     "preferredWorkoutTime" TEXT,
ADD COLUMN     "sleepHours" INTEGER;
