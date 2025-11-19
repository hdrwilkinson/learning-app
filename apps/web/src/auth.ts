import NextAuth from "next-auth";
import { authOptions } from "../../../services/db/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authOptions,
    session: { strategy: "jwt" },
});
