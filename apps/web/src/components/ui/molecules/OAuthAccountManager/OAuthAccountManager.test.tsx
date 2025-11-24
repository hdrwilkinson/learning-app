// Mock dependencies before any imports
jest.mock("next-auth/react", () => ({
    useSession: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("@/app/actions/auth", () => ({
    getConnectedAccounts: jest.fn(),
    disconnectAccount: jest.fn(),
}));
jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { OAuthAccountManager } from "./OAuthAccountManager";
import { useSession, signIn } from "next-auth/react";
import { getConnectedAccounts } from "@/app/actions/auth";
import type { Session } from "next-auth";

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
const mockGetConnectedAccounts = getConnectedAccounts as jest.MockedFunction<
    typeof getConnectedAccounts
>;

describe("OAuthAccountManager", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseSession.mockReturnValue({
            data: {
                user: {
                    id: "user-1",
                    username: "testuser",
                    email: "test@example.com",
                    name: "Test User",
                },
                expires: new Date(Date.now() + 86400000).toISOString(),
            } as Session,
            update: jest.fn().mockResolvedValue(null),
            status: "authenticated" as const,
        });
    });

    it("renders loading state initially", async () => {
        mockGetConnectedAccounts.mockImplementation(
            () => new Promise(() => {}) // Never resolves
        );

        render(<OAuthAccountManager />);

        expect(screen.getByText("Connected Accounts")).toBeInTheDocument();
        expect(screen.getByText("Google")).toBeInTheDocument();
        expect(screen.getByText("GitHub")).toBeInTheDocument();
    });

    it("displays connected accounts", async () => {
        mockGetConnectedAccounts.mockResolvedValue({
            success: true,
            accounts: [
                {
                    id: "acc-1",
                    provider: "google",
                    providerAccountId: "google-123",
                    type: "oauth",
                },
            ],
        });

        render(<OAuthAccountManager />);

        await waitFor(() => {
            expect(screen.getByText("Connected")).toBeInTheDocument();
        });

        expect(screen.getByText("Disconnect")).toBeInTheDocument();
    });

    it("displays connect buttons for unconnected providers", async () => {
        mockGetConnectedAccounts.mockResolvedValue({
            success: true,
            accounts: [],
        });

        render(<OAuthAccountManager />);

        await waitFor(() => {
            const connectButtons = screen.getAllByText("Connect");
            expect(connectButtons.length).toBeGreaterThan(0);
        });
    });

    it("handles connect action", async () => {
        mockGetConnectedAccounts.mockResolvedValue({
            success: true,
            accounts: [],
        });
        mockSignIn.mockResolvedValue({
            ok: true,
            status: 200,
            url: null,
        } as Awaited<ReturnType<typeof signIn>>);

        render(<OAuthAccountManager />);

        await waitFor(() => {
            const connectButtons = screen.getAllByText("Connect");
            connectButtons[0].click();
        });

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalled();
        });
    });

    it("does not render when user is not authenticated", () => {
        mockUseSession.mockReturnValue({
            data: null,
            update: jest.fn().mockResolvedValue(null),
            status: "unauthenticated" as const,
        });

        const { container } = render(<OAuthAccountManager />);
        expect(container.firstChild).toBeNull();
    });
});
