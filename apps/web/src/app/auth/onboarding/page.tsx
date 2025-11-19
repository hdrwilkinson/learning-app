"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingSchema, OnboardingInput } from "@repo/api";
import { updateProfile, checkUsernameAvailability } from "@/app/actions/auth";
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
import { Textarea } from "@/components/ui/shadcn/textarea";
import { HiCheck, HiX } from "react-icons/hi";

export default function OnboardingPage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
        null
    );

    const form = useForm<OnboardingInput>({
        resolver: zodResolver(OnboardingSchema),
        defaultValues: {
            username: "",
            country: "",
            bio: "",
        },
    });

    const username = form.watch("username");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        } else if (status === "authenticated") {
            if (session.user.dateOfBirth && session.user.country) {
                router.push("/");
            }
            if (session.user.username && !form.getValues("username")) {
                form.setValue("username", session.user.username);
            }
        }
    }, [status, session, router, form]);

    // Debounced username check
    useEffect(() => {
        if (!username || username === session?.user?.username) {
            setUsernameAvailable(null);
            return;
        }

        if (username.length < 3) {
            setUsernameAvailable(null);
            return;
        }

        const timer = setTimeout(async () => {
            setIsCheckingUsername(true);
            try {
                const { available } = await checkUsernameAvailability(username);
                setUsernameAvailable(available);
                if (!available) {
                    form.setError("username", {
                        message: "Username is already taken",
                    });
                } else {
                    form.clearErrors("username");
                }
            } catch {
                // Ignore error
            } finally {
                setIsCheckingUsername(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [username, session, form]);

    async function onSubmit(data: OnboardingInput) {
        if (!session?.user?.id) return;
        if (usernameAvailable === false) return;

        setIsLoading(true);
        try {
            const result = await updateProfile(session.user.id, data);

            if (result.error) {
                toast.error(result.error);
                if (result.error.includes("Username")) {
                    form.setError("username", { message: result.error });
                }
            } else {
                toast.success("Profile updated successfully");
                await update(); // Update session
                router.push("/");
                router.refresh();
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">
                        Complete your profile
                    </CardTitle>
                    <CardDescription>
                        We need a few more details to get you started
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Username (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder={
                                                        session?.user
                                                            ?.username ||
                                                        "fast-flyer-909"
                                                    }
                                                    {...field}
                                                    className={
                                                        usernameAvailable ===
                                                        false
                                                            ? "border-destructive focus-visible:ring-destructive"
                                                            : usernameAvailable ===
                                                                true
                                                              ? "border-green-500 focus-visible:ring-green-500"
                                                              : ""
                                                    }
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    {isCheckingUsername ? (
                                                        <span className="text-xs text-muted-foreground">
                                                            ...
                                                        </span>
                                                    ) : usernameAvailable ===
                                                      true ? (
                                                        <HiCheck className="text-green-500" />
                                                    ) : usernameAvailable ===
                                                      false ? (
                                                        <HiX className="text-destructive" />
                                                    ) : null}
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dateOfBirth"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date of Birth</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                value={
                                                    field.value
                                                        ? new Date(field.value)
                                                              .toISOString()
                                                              .split("T")[0]
                                                        : ""
                                                }
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="USA"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell us about yourself"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={
                                    isLoading ||
                                    isCheckingUsername ||
                                    usernameAvailable === false
                                }
                            >
                                {isLoading
                                    ? "Save & Continue"
                                    : "Complete Profile"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
