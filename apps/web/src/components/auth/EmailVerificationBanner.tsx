"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { resendVerificationEmail } from "@/app/actions/auth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { HiX, HiMail } from "react-icons/hi";
import { toast } from "sonner";
import Link from "next/link";

export function EmailVerificationBanner() {
    const { data: session, status, update } = useSession();
    const pathname = usePathname();
    const [isResending, setIsResending] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    // Refresh session periodically to check for email verification status
    // This ensures the banner disappears if user verifies email in another tab/window
    useEffect(() => {
        if (
            status === "authenticated" &&
            session?.user &&
            !session.user.emailVerified &&
            !pathname?.startsWith("/auth")
        ) {
            const interval = setInterval(async () => {
                await update();
            }, 10000); // Check every 10 seconds

            return () => clearInterval(interval);
        }
    }, [status, session, pathname, update]);

    // Don't show on auth pages or if not authenticated
    if (
        status !== "authenticated" ||
        !session?.user ||
        pathname?.startsWith("/auth") ||
        session.user.emailVerified ||
        isDismissed
    ) {
        return null;
    }

    const handleResend = async () => {
        if (!session.user?.email) return;

        setIsResending(true);
        try {
            const result = await resendVerificationEmail(session.user.email);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(
                    result.message ||
                        "Verification email sent. Please check your inbox."
                );
                // Refresh session to get latest emailVerified status
                await update();
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
            {/* Mobile/Tablet: Full width, padding matches SecondaryNav */}
            <div className="lg:hidden px-4 md:px-6 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <HiMail className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                Please verify your email address
                            </p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-0.5">
                                Check your inbox for a verification link.{" "}
                                <Link
                                    href="/auth/resend-verification"
                                    className="underline hover:no-underline"
                                >
                                    Need a new link?
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResend}
                            disabled={isResending}
                            className="border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-900/40"
                        >
                            {isResending ? "Sending..." : "Resend"}
                        </Button>
                        <button
                            onClick={() => setIsDismissed(true)}
                            className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 p-1"
                            aria-label="Dismiss banner"
                        >
                            <HiX className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
            {/* Desktop: Full width at top, above content/accessory divide */}
            <div className="hidden lg:block px-6 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <HiMail className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                Please verify your email address
                            </p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-0.5">
                                Check your inbox for a verification link.{" "}
                                <Link
                                    href="/auth/resend-verification"
                                    className="underline hover:no-underline"
                                >
                                    Need a new link?
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResend}
                            disabled={isResending}
                            className="border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-900/40"
                        >
                            {isResending ? "Sending..." : "Resend"}
                        </Button>
                        <button
                            onClick={() => setIsDismissed(true)}
                            className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 p-1"
                            aria-label="Dismiss banner"
                        >
                            <HiX className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
