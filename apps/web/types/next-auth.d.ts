import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            dateOfBirth?: Date;
            country?: string;
            bio?: string;
            emailVerified?: Date | null;
        } & DefaultSession["user"];
    }

    interface User {
        username?: string;
        dateOfBirth?: Date;
        country?: string;
        bio?: string;
        password?: string;
        emailVerified?: Date | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        username?: string;
        dateOfBirth?: Date;
        country?: string;
        bio?: string;
        emailVerified?: Date | null;
    }
}
