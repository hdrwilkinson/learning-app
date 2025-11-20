import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

export const authConfig = {
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/signout",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    ],
    trustHost: true,
    callbacks: {
        authorized({ auth }) {
            return !!auth?.user;
        },
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.user.dateOfBirth = token.dateOfBirth as Date;
                session.user.country = token.country as string;
                session.user.bio = token.bio as string;
            }
            return session;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                // Note: In middleware we don't have DB access to fetch extra fields
                // We rely on what's already in the token or what's passed in session update
            }

            // Handle session updates in middleware context if possible
            if (trigger === "update" && session) {
                return { ...token, ...session };
            }

            return token;
        },
    },
} satisfies NextAuthConfig;
