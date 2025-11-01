/**
 * Next.js API route handler for Auth.js
 */

import NextAuth from "next-auth";
import { authOptions } from "../../../../../../../services/db/auth";
import type { NextRequest, NextResponse } from "next/server";

const handler = NextAuth(authOptions) as unknown as (
    req: NextRequest
) => Promise<NextResponse>;

export { handler as GET, handler as POST };
