import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../../../services/db/db-client";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { generateUsername } from "@repo/lib";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    providers: [
        ...authConfig.providers,
        Credentials({
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
            // Refetch user data from database when session is updated
            if (trigger === "update" && token.id) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id as string },
                });
                if (dbUser) {
                    token.username = dbUser.username;
                    token.dateOfBirth = dbUser.dateOfBirth;
                    token.country = dbUser.country;
                    token.bio = dbUser.bio;
                }
                // Also merge any session data if provided
                if (session) {
                    token = { ...token, ...session };
                }
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
});
