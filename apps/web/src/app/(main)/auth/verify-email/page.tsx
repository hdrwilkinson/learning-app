"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/app/actions/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/shadcn/button";
import Link from "next/link";
import { toast } from "sonner";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";

function VerifyEmailForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();
    const [status, setStatus] = useState<
        "loading" | "success" | "error" | null
    >(null);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("No verification token provided");
            return;
        }

        const handleVerification = async () => {
            setStatus("loading");
            try {
                const result = await verifyEmail(token);
                if (result.error) {
                    setStatus("error");
                    setMessage(result.error);
                    toast.error(result.error);
                } else {
                    setStatus("success");
                    setMessage(result.message || "Email verified successfully");
                    toast.success(
                        result.message || "Email verified successfully"
                    );
                    // Redirect to login after 2 seconds
                    setTimeout(() => {
                        router.push("/auth/login?verified=true");
                    }, 2000);
                }
            } catch {
                setStatus("error");
                setMessage("Something went wrong");
                toast.error("Something went wrong");
            }
        };

        handleVerification();
    }, [token, router]);

    return (
        <AuthCard
            title="Verify Email"
            description={
                status === "loading"
                    ? "Verifying your email address..."
                    : status === "success"
                      ? "Email verified successfully"
                      : "Email verification"
            }
        >
            <div className="space-y-4 text-center">
                {status === "loading" && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        <p className="text-sm text-muted-foreground">
                            Please wait while we verify your email...
                        </p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center gap-4">
                        <HiCheckCircle className="h-12 w-12 text-green-500" />
                        <p className="text-sm text-muted-foreground">
                            {message}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Redirecting to login...
                        </p>
                        <Button asChild className="w-full">
                            <Link href="/auth/login">Go to Login</Link>
                        </Button>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center gap-4">
                        <HiXCircle className="h-12 w-12 text-red-500" />
                        <p className="text-sm text-muted-foreground">
                            {message}
                        </p>
                        <div className="flex flex-col gap-2 w-full">
                            <Button
                                asChild
                                variant="outline"
                                className="w-full"
                            >
                                <Link href="/auth/resend-verification">
                                    Request New Verification Email
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full"
                            >
                                <Link href="/auth/login">Back to Login</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AuthCard>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailForm />
        </Suspense>
    );
}
