/**
 * Prisma seed entry point
 * Run with: npx prisma db seed
 */

import { seed, prisma } from "./seed/index";

seed()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
