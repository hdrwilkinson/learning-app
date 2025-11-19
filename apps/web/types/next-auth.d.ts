import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            dateOfBirth?: Date;
            country?: string;
            bio?: string;
        } & DefaultSession["user"];
    }

    interface User {
        username?: string;
        dateOfBirth?: Date;
        country?: string;
        bio?: string;
        password?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        username?: string;
        dateOfBirth?: Date;
        country?: string;
        bio?: string;
    }
}
