/*
  Warnings:

  - You are about to drop the column `goal` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `timeline` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `timeSpent` on the `QuizResponse` table. All the data in the column will be lost.
  - You are about to drop the `QuizQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProgress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `InformationPoint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quizTypeId` to the `QuizResponse` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CourseVisibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "CourseGenerationStatus" AS ENUM ('PENDING', 'GENERATING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "CourseRole" AS ENUM ('CREATOR', 'ADMIN', 'STUDENT');

-- CreateEnum
CREATE TYPE "GroupJoinPolicy" AS ENUM ('OPEN', 'MEMBER_INVITE', 'LEADER_ONLY', 'INVITE_ONLY');

-- CreateEnum
CREATE TYPE "GroupRole" AS ENUM ('LEADER', 'MEMBER');

-- CreateEnum
CREATE TYPE "ProgressState" AS ENUM ('UNSEEN', 'LEARNING', 'REVIEWING', 'MASTERED');

-- CreateEnum
CREATE TYPE "QuestionDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_userId_fkey";

-- DropForeignKey
ALTER TABLE "QuizQuestion" DROP CONSTRAINT "QuizQuestion_informationPointId_fkey";

-- DropForeignKey
ALTER TABLE "QuizResponse" DROP CONSTRAINT "QuizResponse_questionId_fkey";

-- DropForeignKey
ALTER TABLE "UserProgress" DROP CONSTRAINT "UserProgress_informationPointId_fkey";

-- DropIndex
DROP INDEX "Course_userId_idx";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "goal",
DROP COLUMN "timeline",
DROP COLUMN "userId",
ADD COLUMN     "generationStatus" "CourseGenerationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "topic" TEXT,
ADD COLUMN     "visibility" "CourseVisibility" NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "InformationPoint" ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "typeId" TEXT;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "QuizResponse" DROP COLUMN "timeSpent",
ADD COLUMN     "baselineBefore" DOUBLE PRECISION,
ADD COLUMN     "masteryBefore" DOUBLE PRECISION,
ADD COLUMN     "quizTypeId" TEXT NOT NULL,
ADD COLUMN     "responseTimeMs" INTEGER,
ADD COLUMN     "sessionId" TEXT,
ADD COLUMN     "stabilityBefore" DOUBLE PRECISION;

-- DropTable
DROP TABLE "QuizQuestion";

-- DropTable
DROP TABLE "UserProgress";

-- DropEnum
DROP TYPE "QuestionType";

-- DropEnum
DROP TYPE "QuizDifficulty";

-- CreateTable
CREATE TABLE "CourseMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "courseRole" "CourseRole" NOT NULL,
    "learningGoal" TEXT,
    "schedule" JSONB,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseGroup" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "joinPolicy" "GroupJoinPolicy" NOT NULL DEFAULT 'INVITE_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "groupRole" "GroupRole" NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InformationPointType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InformationPointType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "difficultyWeight" DOUBLE PRECISION NOT NULL,
    "minMasteryToUnlock" DOUBLE PRECISION NOT NULL,
    "masteryBoostOnCorrect" DOUBLE PRECISION NOT NULL,
    "stabilityMultiplier" DOUBLE PRECISION NOT NULL,
    "applicableContentTypes" TEXT[],
    "requiresLLMGrading" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InformationPointQuizType" (
    "id" TEXT NOT NULL,
    "informationPointId" TEXT NOT NULL,
    "quizTypeId" TEXT NOT NULL,

    CONSTRAINT "InformationPointQuizType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InformationPointPrerequisite" (
    "id" TEXT NOT NULL,
    "prerequisiteId" TEXT NOT NULL,
    "dependentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InformationPointPrerequisite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InformationPointProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "informationPointId" TEXT NOT NULL,
    "state" "ProgressState" NOT NULL DEFAULT 'UNSEEN',
    "masteryLevel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "baselineMastery" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "baselineConfidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stability" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "nextReviewAt" TIMESTAMP(3),
    "totalAttempts" INTEGER NOT NULL DEFAULT 0,
    "correctAttempts" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "lapseCount" INTEGER NOT NULL DEFAULT 0,
    "introducedAt" TIMESTAMP(3),
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InformationPointProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedQuestion" (
    "id" TEXT NOT NULL,
    "informationPointId" TEXT NOT NULL,
    "quizTypeId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "difficulty" "QuestionDifficulty" NOT NULL,
    "correctAnswer" BOOLEAN,
    "options" JSONB,
    "correctOptionIndex" INTEGER,
    "expectedAnswer" TEXT,
    "gradingRubric" JSONB,
    "keyPoints" TEXT[],
    "acceptableVariations" TEXT[],
    "explanation" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modelUsed" TEXT,
    "generationBatchId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourseMembership_userId_idx" ON "CourseMembership"("userId");

-- CreateIndex
CREATE INDEX "CourseMembership_courseId_idx" ON "CourseMembership"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseMembership_userId_courseId_key" ON "CourseMembership"("userId", "courseId");

-- CreateIndex
CREATE INDEX "CourseGroup_courseId_idx" ON "CourseGroup"("courseId");

-- CreateIndex
CREATE INDEX "GroupMembership_userId_idx" ON "GroupMembership"("userId");

-- CreateIndex
CREATE INDEX "GroupMembership_groupId_idx" ON "GroupMembership"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMembership_userId_groupId_key" ON "GroupMembership"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "InformationPointType_name_key" ON "InformationPointType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "QuizType_name_key" ON "QuizType"("name");

-- CreateIndex
CREATE INDEX "InformationPointQuizType_informationPointId_idx" ON "InformationPointQuizType"("informationPointId");

-- CreateIndex
CREATE INDEX "InformationPointQuizType_quizTypeId_idx" ON "InformationPointQuizType"("quizTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "InformationPointQuizType_informationPointId_quizTypeId_key" ON "InformationPointQuizType"("informationPointId", "quizTypeId");

-- CreateIndex
CREATE INDEX "InformationPointPrerequisite_prerequisiteId_idx" ON "InformationPointPrerequisite"("prerequisiteId");

-- CreateIndex
CREATE INDEX "InformationPointPrerequisite_dependentId_idx" ON "InformationPointPrerequisite"("dependentId");

-- CreateIndex
CREATE UNIQUE INDEX "InformationPointPrerequisite_prerequisiteId_dependentId_key" ON "InformationPointPrerequisite"("prerequisiteId", "dependentId");

-- CreateIndex
CREATE INDEX "InformationPointProgress_userId_idx" ON "InformationPointProgress"("userId");

-- CreateIndex
CREATE INDEX "InformationPointProgress_informationPointId_idx" ON "InformationPointProgress"("informationPointId");

-- CreateIndex
CREATE INDEX "InformationPointProgress_nextReviewAt_idx" ON "InformationPointProgress"("nextReviewAt");

-- CreateIndex
CREATE UNIQUE INDEX "InformationPointProgress_userId_informationPointId_key" ON "InformationPointProgress"("userId", "informationPointId");

-- CreateIndex
CREATE INDEX "GeneratedQuestion_informationPointId_idx" ON "GeneratedQuestion"("informationPointId");

-- CreateIndex
CREATE INDEX "GeneratedQuestion_quizTypeId_idx" ON "GeneratedQuestion"("quizTypeId");

-- CreateIndex
CREATE INDEX "GeneratedQuestion_generationBatchId_idx" ON "GeneratedQuestion"("generationBatchId");

-- CreateIndex
CREATE INDEX "InformationPoint_typeId_idx" ON "InformationPoint"("typeId");

-- CreateIndex
CREATE INDEX "QuizResponse_quizTypeId_idx" ON "QuizResponse"("quizTypeId");

-- CreateIndex
CREATE INDEX "QuizResponse_sessionId_idx" ON "QuizResponse"("sessionId");

-- AddForeignKey
ALTER TABLE "CourseMembership" ADD CONSTRAINT "CourseMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMembership" ADD CONSTRAINT "CourseMembership_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseGroup" ADD CONSTRAINT "CourseGroup_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembership" ADD CONSTRAINT "GroupMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembership" ADD CONSTRAINT "GroupMembership_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InformationPoint" ADD CONSTRAINT "InformationPoint_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "InformationPointType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InformationPointQuizType" ADD CONSTRAINT "InformationPointQuizType_informationPointId_fkey" FOREIGN KEY ("informationPointId") REFERENCES "InformationPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InformationPointQuizType" ADD CONSTRAINT "InformationPointQuizType_quizTypeId_fkey" FOREIGN KEY ("quizTypeId") REFERENCES "QuizType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InformationPointPrerequisite" ADD CONSTRAINT "InformationPointPrerequisite_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "InformationPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InformationPointPrerequisite" ADD CONSTRAINT "InformationPointPrerequisite_dependentId_fkey" FOREIGN KEY ("dependentId") REFERENCES "InformationPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InformationPointProgress" ADD CONSTRAINT "InformationPointProgress_informationPointId_fkey" FOREIGN KEY ("informationPointId") REFERENCES "InformationPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedQuestion" ADD CONSTRAINT "GeneratedQuestion_informationPointId_fkey" FOREIGN KEY ("informationPointId") REFERENCES "InformationPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedQuestion" ADD CONSTRAINT "GeneratedQuestion_quizTypeId_fkey" FOREIGN KEY ("quizTypeId") REFERENCES "QuizType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResponse" ADD CONSTRAINT "QuizResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "GeneratedQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResponse" ADD CONSTRAINT "QuizResponse_quizTypeId_fkey" FOREIGN KEY ("quizTypeId") REFERENCES "QuizType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
