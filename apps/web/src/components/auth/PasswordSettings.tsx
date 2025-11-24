"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ChangePasswordSchema,
    ChangePasswordInput,
    SetPasswordSchema,
    SetPasswordInput,
} from "@repo/api";
import { changePassword, setPassword } from "@/app/actions/password";
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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/shadcn/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PasswordSettingsProps {
    hasPassword: boolean;
    onPasswordSet?: () => void;
}

export function PasswordSettings({
    hasPassword,
    onPasswordSet,
}: PasswordSettingsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const changePasswordForm = useForm<ChangePasswordInput>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const setPasswordForm = useForm<SetPasswordInput>({
        resolver: zodResolver(SetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    async function onChangeSubmit(data: ChangePasswordInput) {
        setIsLoading(true);
        try {
            const result = await changePassword(data);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.success);
                changePasswordForm.reset();
                router.refresh();
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    async function onSetSubmit(data: SetPasswordInput) {
        setIsLoading(true);
        try {
            const result = await setPassword(data);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.success);
                setPasswordForm.reset();
                router.refresh();
                onPasswordSet?.();
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    if (!hasPassword) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="font-display-grounded text-2xl font-bold">
                        Set Password
                    </CardTitle>
                    <CardDescription>
                        You currently sign in with a third-party provider. Set a
                        password to enable email/password login.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...setPasswordForm}>
                        <form
                            onSubmit={setPasswordForm.handleSubmit(onSetSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={setPasswordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={setPasswordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading
                                        ? "Setting password..."
                                        : "Set Password"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-display-grounded text-2xl font-bold">
                    Change Password
                </CardTitle>
                <CardDescription>
                    Update your password associated with your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...changePasswordForm}>
                    <form
                        onSubmit={changePasswordForm.handleSubmit(
                            onChangeSubmit
                        )}
                        className="space-y-4"
                    >
                        <FormField
                            control={changePasswordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={changePasswordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={changePasswordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading
                                    ? "Updating password..."
                                    : "Update Password"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
