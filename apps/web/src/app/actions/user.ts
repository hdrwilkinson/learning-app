"use server";

import { auth } from "@/auth";
import { prisma } from "../../../../../services/db/db-client";

export async function checkUserHasPassword() {
    const session = await auth();

    if (!session?.user?.id) {
        return false;
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
    });

    return !!user?.password;
}
