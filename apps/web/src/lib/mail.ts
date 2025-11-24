import { Resend } from "resend";

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        throw new Error(
            "RESEND_API_KEY is not configured. Please add it to your .env.local file."
        );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl) {
        throw new Error(
            "NEXT_PUBLIC_APP_URL is not configured. Please add it to your .env.local file."
        );
    }

    const resend = new Resend(apiKey);
    const resetLink = `${appUrl}/auth/new-password?token=${token}`;

    await resend.emails.send({
        from: "Learning App <onboarding@resend.dev>",
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });
};
