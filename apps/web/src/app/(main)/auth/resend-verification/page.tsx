"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ControllerRenderProps } from "react-hook-form";
import { ResendVerificationSchema, ResendVerificationInput } from "@repo/api";
import { resendVerificationEmail } from "@/app/actions/auth";
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

export default function ResendVerificationPage() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ResendVerificationInput>({
        resolver: zodResolver(ResendVerificationSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(data: ResendVerificationInput) {
        setIsLoading(true);
        try {
            const result = await resendVerificationEmail(data.email);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(
                    result.message ||
                        "Verification email sent. Please check your inbox."
                );
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthCard
            title="Resend Verification Email"
            description="Enter your email address to receive a new verification link"
            footer={
                <p className="text-sm text-muted-foreground">
                    Already verified?{" "}
                    <Link
                        href="/auth/login"
                        className="text-primary hover:underline"
                    >
                        Login
                    </Link>
                </p>
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
                                ResendVerificationInput,
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
                        {isLoading
                            ? "Sending email..."
                            : "Send verification email"}
                    </Button>
                </form>
            </Form>
        </AuthCard>
    );
}
