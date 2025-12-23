/*
  Warnings:

  - Added the required column `completionPercent` to the `CourseRating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `masteryPercent` to the `CourseRating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseRating" ADD COLUMN     "completionPercent" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "masteryPercent" DOUBLE PRECISION NOT NULL;

-- AddForeignKey
ALTER TABLE "CourseRating" ADD CONSTRAINT "CourseRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
