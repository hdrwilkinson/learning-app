import { handlers } from "@/auth";
import { NextRequest } from "next/server";
import {
    setCurrentRequestHeaders,
    clearCurrentRequestHeaders,
} from "@/lib/request-context";

// Wrap handlers to store request headers for login tracking
const originalGET = handlers.GET;
const originalPOST = handlers.POST;

handlers.GET = async (req: NextRequest) => {
    setCurrentRequestHeaders(req.headers);
    try {
        return await originalGET(req);
    } finally {
        clearCurrentRequestHeaders();
    }
};

handlers.POST = async (req: NextRequest) => {
    setCurrentRequestHeaders(req.headers);
    try {
        return await originalPOST(req);
    } finally {
        clearCurrentRequestHeaders();
    }
};

export const { GET, POST } = handlers;
