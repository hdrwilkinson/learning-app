"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ControllerRenderProps } from "react-hook-form";
import { ResetPasswordSchema, ResetPasswordInput } from "@repo/api";
import { resetPassword } from "@/app/actions/password";
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

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ResetPasswordInput>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(data: ResetPasswordInput) {
        setIsLoading(true);
        try {
            const result = await resetPassword(data);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.success);
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthCard
            title="Reset Password"
            description="Enter your email to reset your password"
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
                        name="email"
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                ResetPasswordInput,
                                "email"
                            >;
                        }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="m@example.com"
                                        {...field}
                                        disabled={isLoading}
                                    />
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
                        {isLoading ? "Sending email..." : "Send reset email"}
                    </Button>
                </form>
            </Form>
        </AuthCard>
    );
}
