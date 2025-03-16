-- AlterTable
ALTER TABLE "User" ADD COLUMN     "availableEquipment" TEXT[],
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "workoutDaysPerWeek" INTEGER DEFAULT 4,
ADD COLUMN     "workoutDuration" INTEGER DEFAULT 30,
ADD COLUMN     "workoutLocation" TEXT DEFAULT 'HOME';
