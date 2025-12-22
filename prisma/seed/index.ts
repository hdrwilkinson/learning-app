/**
 * Main seed orchestration
 * Seeds lookup tables and course content into the database
 */

import { PrismaClient } from "@prisma/client";
import { informationPointTypes, quizTypes } from "./lookup-tables";
import { psychologyCourse } from "./courses/psychology";
import { philosophyCourse } from "./courses/philosophy";
import { statisticsCourse } from "./courses/statistics";
import type { SeedCourse } from "./types";

const prisma = new PrismaClient();

/**
 * Seeds the InformationPointType lookup table
 */
async function seedInformationPointTypes(): Promise<Map<string, string>> {
    console.log("Seeding InformationPointType lookup table...");

    const typeMap = new Map<string, string>();

    for (const ipType of informationPointTypes) {
        const created = await prisma.informationPointType.upsert({
            where: { name: ipType.name },
            update: { description: ipType.description },
            create: {
                name: ipType.name,
                description: ipType.description,
            },
        });
        typeMap.set(ipType.name, created.id);
        console.log(`  ✓ ${ipType.name}`);
    }

    return typeMap;
}

/**
 * Seeds the QuizType lookup table
 */
async function seedQuizTypes(): Promise<Map<string, string>> {
    console.log("Seeding QuizType lookup table...");

    const typeMap = new Map<string, string>();

    for (const quizType of quizTypes) {
        const created = await prisma.quizType.upsert({
            where: { name: quizType.name },
            update: {
                displayName: quizType.displayName,
                description: quizType.description,
                difficultyWeight: quizType.difficultyWeight,
                minMasteryToUnlock: quizType.minMasteryToUnlock,
                masteryBoostOnCorrect: quizType.masteryBoostOnCorrect,
                stabilityMultiplier: quizType.stabilityMultiplier,
                applicableContentTypes: [...quizType.applicableContentTypes],
                requiresLLMGrading: quizType.requiresLLMGrading,
                isActive: quizType.isActive,
            },
            create: {
                name: quizType.name,
                displayName: quizType.displayName,
                description: quizType.description,
                difficultyWeight: quizType.difficultyWeight,
                minMasteryToUnlock: quizType.minMasteryToUnlock,
                masteryBoostOnCorrect: quizType.masteryBoostOnCorrect,
                stabilityMultiplier: quizType.stabilityMultiplier,
                applicableContentTypes: [...quizType.applicableContentTypes],
                requiresLLMGrading: quizType.requiresLLMGrading,
                isActive: quizType.isActive,
            },
        });
        typeMap.set(quizType.name, created.id);
        console.log(`  ✓ ${quizType.displayName}`);
    }

    return typeMap;
}

/**
 * Seeds a single course with all its modules, lessons, and information points
 */
async function seedCourse(
    courseData: SeedCourse,
    ipTypeMap: Map<string, string>,
    quizTypeMap: Map<string, string>
): Promise<void> {
    console.log(`\nSeeding course: ${courseData.title}...`);

    // Create the course
    const course = await prisma.course.create({
        data: {
            title: courseData.title,
            description: courseData.description,
            topic: courseData.topic,
            visibility: "PUBLIC",
            generationStatus: "COMPLETED",
        },
    });

    console.log(`  Created course: ${course.id}`);

    let totalIPs = 0;

    // Create modules
    for (const moduleData of courseData.modules) {
        const courseModule = await prisma.module.create({
            data: {
                courseId: course.id,
                title: moduleData.title,
                description: moduleData.description,
                order: moduleData.order,
            },
        });

        console.log(`    Module ${moduleData.order}: ${moduleData.title}`);

        // Create lessons
        for (const lessonData of moduleData.lessons) {
            const lesson = await prisma.lesson.create({
                data: {
                    moduleId: courseModule.id,
                    title: lessonData.title,
                    description: lessonData.description,
                    order: lessonData.order,
                },
            });

            // Create information points
            for (const ipData of lessonData.informationPoints) {
                const typeId = ipTypeMap.get(ipData.type);
                if (!typeId) {
                    throw new Error(
                        `Unknown information point type: ${ipData.type}`
                    );
                }

                const informationPoint = await prisma.informationPoint.create({
                    data: {
                        lessonId: lesson.id,
                        typeId: typeId,
                        title: ipData.title,
                        content: ipData.content,
                        order: ipData.order,
                    },
                });

                // Create quiz type associations
                for (const quizTypeName of ipData.quizTypes) {
                    const quizTypeId = quizTypeMap.get(quizTypeName);
                    if (!quizTypeId) {
                        throw new Error(`Unknown quiz type: ${quizTypeName}`);
                    }

                    await prisma.informationPointQuizType.create({
                        data: {
                            informationPointId: informationPoint.id,
                            quizTypeId: quizTypeId,
                        },
                    });
                }

                totalIPs++;
            }
        }
    }

    console.log(`  ✓ Created ${totalIPs} information points`);
}

/**
 * Clears all seeded course data
 * Use with caution - this will delete all courses!
 */
async function clearCourseData(): Promise<void> {
    console.log("Clearing existing course data...");

    // Delete in order of dependencies (children first)
    await prisma.informationPointQuizType.deleteMany({});
    await prisma.informationPointPrerequisite.deleteMany({});
    await prisma.informationPointProgress.deleteMany({});
    await prisma.quizResponse.deleteMany({});
    await prisma.generatedQuestion.deleteMany({});
    await prisma.informationPoint.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.module.deleteMany({});
    await prisma.groupMembership.deleteMany({});
    await prisma.courseGroup.deleteMany({});
    await prisma.courseMembership.deleteMany({});
    await prisma.course.deleteMany({});

    console.log("  ✓ Cleared all course data");
}

/**
 * Main seed function
 */
export async function seed(): Promise<void> {
    console.log("🌱 Starting database seed...\n");

    try {
        // Clear existing data
        await clearCourseData();

        // Seed lookup tables
        const ipTypeMap = await seedInformationPointTypes();
        const quizTypeMap = await seedQuizTypes();

        // Seed courses
        const courses: SeedCourse[] = [
            psychologyCourse,
            philosophyCourse,
            statisticsCourse,
        ];

        for (const courseData of courses) {
            await seedCourse(courseData, ipTypeMap, quizTypeMap);
        }

        console.log("\n✅ Database seed completed successfully!");
    } catch (error) {
        console.error("\n❌ Seed failed:", error);
        throw error;
    }
}

// Export for direct execution
export { prisma };
