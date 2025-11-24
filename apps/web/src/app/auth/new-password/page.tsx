"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ControllerRenderProps } from "react-hook-form";
import { NewPasswordSchema, NewPasswordInput } from "@repo/api";
import { newPassword } from "@/app/actions/password";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/shadcn/form";
import { toast } from "sonner";
import { AuthCard } from "@/components/auth/AuthCard";
import Link from "next/link";
import { HiCheck, HiX, HiEye, HiEyeOff } from "react-icons/hi";

function NewPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<NewPasswordInput>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const password = form.watch("password");

    const requirements = [
        { label: "At least 8 characters", valid: password?.length >= 8 },
        {
            label: "At least one uppercase letter",
            valid: /[A-Z]/.test(password || ""),
        },
        {
            label: "At least one lowercase letter",
            valid: /[a-z]/.test(password || ""),
        },
        { label: "At least one number", valid: /[0-9]/.test(password || "") },
        {
            label: "At least one special character",
            valid: /[^a-zA-Z0-9]/.test(password || ""),
        },
    ];

    async function onSubmit(data: NewPasswordInput) {
        setIsLoading(true);
        try {
            const result = await newPassword(data, token);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.success);
                router.push("/auth/login");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthCard
            title="Enter new password"
            description="Enter your new password below"
            footer={
                <Link
                    href="/auth/login"
                    className="text-sm text-primary hover:underline"
                >
                    Back to login
                </Link>
            }
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="password"
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                NewPasswordInput,
                                "password"
                            >;
                        }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="******"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            disabled={isLoading}
                                        >
                                            {showPassword ? (
                                                <HiEyeOff className="h-4 w-4" />
                                            ) : (
                                                <HiEye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                                <div className="mt-2 space-y-1 rounded-md border p-3 text-sm">
                                    <p className="mb-2 font-medium">
                                        Password Requirements:
                                    </p>
                                    {requirements.map((req, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            {req.valid ? (
                                                <HiCheck className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <HiX className="h-4 w-4 text-red-500" />
                                            )}
                                            <span
                                                className={
                                                    req.valid
                                                        ? "text-green-500"
                                                        : "text-muted-foreground"
                                                }
                                            >
                                                {req.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                NewPasswordInput,
                                "confirmPassword"
                            >;
                        }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="******"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            disabled={isLoading}
                                        >
                                            {showConfirmPassword ? (
                                                <HiEyeOff className="h-4 w-4" />
                                            ) : (
                                                <HiEye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Resetting password..." : "Reset password"}
                    </Button>
                </form>
            </Form>
        </AuthCard>
    );
}

export default function NewPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewPasswordForm />
        </Suspense>
    );
}
