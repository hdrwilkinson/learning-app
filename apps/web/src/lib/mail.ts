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
export const sendVerificationEmail = async (email: string, token: string) => {
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
    const verificationLink = `${appUrl}/auth/verify-email?token=${token}`;

    await resend.emails.send({
        from: "Learning App <onboarding@resend.dev>",
        to: email,
        subject: "Verify your email address",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Verify your email address</h2>
                <p>Thank you for signing up! Please verify your email address to complete your account setup.</p>
                <p>
                    <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">
                        Verify Email Address
                    </a>
                </p>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666;">${verificationLink}</p>
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
                </p>
            </div>
        `,
    });
};
