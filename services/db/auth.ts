/**
 * Auth.js configuration
 * Handles authentication with Prisma adapter
 */

import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db-client";
import bcrypt from "bcrypt";
import { generateUsername } from "@repo/lib";

export const authOptions: NextAuthConfig = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user || !user.password) {
                    return null;
                }

                const isValid = await bcrypt.compare(password, user.password);

                if (!isValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/login",
        signOut: "/auth/signout",
        error: "/auth/error",
    },
    events: {
        async createUser({ user }) {
            if (!user.username) {
                let username = generateUsername();
                let exists = await prisma.user.findUnique({
                    where: { username },
                });
                let retries = 0;
                while (exists && retries < 3) {
                    username = generateUsername();
                    exists = await prisma.user.findUnique({
                        where: { username },
                    });
                    retries++;
                }

                await prisma.user.update({
                    where: { id: user.id },
                    data: { username },
                });
            }
        },
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                const dbUser = await prisma.user.findUnique({
                    where: { id: user.id },
                });
                if (dbUser) {
                    token.username = dbUser.username;
                    token.dateOfBirth = dbUser.dateOfBirth;
                    token.country = dbUser.country;
                    token.bio = dbUser.bio;
                }
            }
            if (trigger === "update" && session) {
                token = { ...token, ...session };
            }
            return token;
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
    },
    secret: process.env.NEXTAUTH_SECRET,
};
