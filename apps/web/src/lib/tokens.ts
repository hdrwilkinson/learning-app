import { v4 as uuidv4 } from "uuid";
import { prisma } from "../../../../services/db/db-client";

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

    const existingToken = await prisma.passwordResetToken.findFirst({
        where: { email },
    });

    if (existingToken) {
        await prisma.passwordResetToken.delete({
            where: { id: existingToken.id },
        });
    }

    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    return passwordResetToken;
};
export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 24 * 3600 * 1000); // 24 hours

    // Delete existing tokens for this email
    await prisma.verificationToken.deleteMany({
        where: { identifier: email },
    });

    const verificationToken = await prisma.verificationToken.create({
        data: {
            identifier: email,
            token,
            expires,
        },
    });

    return verificationToken;
};
