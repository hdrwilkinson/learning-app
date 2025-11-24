"use server";

import { auth } from "@/auth";
import { prisma } from "../../../../../services/db/db-client";

/**
 * Get paginated login history for the current user
 */
export async function getLoginHistory(page: number = 1, limit: number = 20) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        const skip = (page - 1) * limit;

        const [history, total] = await Promise.all([
            prisma.loginHistory.findMany({
                where: {
                    userId: session.user.id,
                },
                orderBy: {
                    loginAt: "desc",
                },
                skip,
                take: limit,
                select: {
                    id: true,
                    deviceName: true,
                    location: true,
                    ipAddress: true,
                    loginAt: true,
                },
            }),
            prisma.loginHistory.count({
                where: {
                    userId: session.user.id,
                },
            }),
        ]);

        return {
            success: true,
            history,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.error("Get login history error:", error);
        return { error: "Failed to fetch login history" };
    }
}
