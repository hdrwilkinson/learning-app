-- AlterTable
ALTER TABLE "CourseMembership" ADD COLUMN     "appearInLeaderboards" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "emailReminders" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showProgressToGroup" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "weeklyProgressEmail" BOOLEAN NOT NULL DEFAULT true;
