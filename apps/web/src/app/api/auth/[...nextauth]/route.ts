/**
 * Next.js API route handler for Auth.js
 */

import NextAuth from "next-auth";
import { authOptions } from "../../../../../../services/db/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
