"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/shadcn/select";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { HiCheck, HiX } from "react-icons/hi";
import { AuthCard } from "@/components/auth/AuthCard";
import { COUNTRIES } from "@repo/lib";

export default function OnboardingPage() {
    const { data: session, update } = useSession();
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

    // Populate form from session data if available
    useEffect(() => {
        if (session?.user) {
            if (session.user.username && !form.getValues("username")) {
                form.setValue("username", session.user.username);
            }
            if (session.user.dateOfBirth && !form.getValues("dateOfBirth")) {
                const dateStr = new Date(session.user.dateOfBirth)
                    .toISOString()
                    .split("T")[0];
                // @ts-expect-error - dateOfBirth expects Date, but we need string for input
                form.setValue("dateOfBirth", dateStr);
            }
            if (session.user.country && !form.getValues("country")) {
                form.setValue("country", session.user.country);
            }
            if (session.user.bio && !form.getValues("bio")) {
                form.setValue("bio", session.user.bio);
            }
        }
    }, [session, form]);

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
                const { available } = await checkUsernameAvailability(
                    username,
                    session?.user?.id
                );
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
                setIsLoading(false);
                return;
            }

            toast.success("Profile updated successfully");

            // Update session - passing an object ensures POST request and triggers
            // the JWT callback with trigger: "update", which refetches user data from DB
            await update({});

            // Use window.location for a full page reload to ensure middleware
            // sees the updated session and redirects complete profiles to home
            window.location.href = "/";
        } catch (error) {
            console.error("Onboarding submission error:", error);
            toast.error("Something went wrong");
            setIsLoading(false);
        }
    }

    // Show loading if session is not ready
    if (!session) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <AuthCard
            title="Complete your profile"
            description="We need a few more details to get you started"
        >
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
                                <FormLabel>Username (Optional)</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            placeholder={
                                                session?.user?.username ||
                                                "fast-flyer-909"
                                            }
                                            {...field}
                                            className={
                                                usernameAvailable === false
                                                    ? "border-destructive focus-visible:ring-destructive"
                                                    : usernameAvailable === true
                                                      ? "border-green-500 focus-visible:ring-green-500"
                                                      : ""
                                            }
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {isCheckingUsername ? (
                                                <span className="text-xs text-muted-foreground">
                                                    ...
                                                </span>
                                            ) : usernameAvailable === true ? (
                                                <HiCheck className="text-green-500" />
                                            ) : usernameAvailable === false ? (
                                                <HiX className="text-destructive" />
                                            ) : null}
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                                {session?.user?.username && (
                                    <p className="text-xs text-muted-foreground">
                                        Current username:{" "}
                                        <span className="font-mono">
                                            {session.user.username}
                                        </span>
                                    </p>
                                )}
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
                                            field.value instanceof Date
                                                ? field.value
                                                      .toISOString()
                                                      .split("T")[0]
                                                : typeof field.value ===
                                                    "string"
                                                  ? (
                                                        field.value as string
                                                    ).split("T")[0]
                                                  : ""
                                        }
                                        onChange={(e) =>
                                            field.onChange(e.target.value)
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
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {COUNTRIES.map((country) => (
                                            <SelectItem
                                                key={country}
                                                value={country}
                                            >
                                                {country}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                        {isLoading ? "Save & Continue" : "Complete Profile"}
                    </Button>
                </form>
            </Form>
        </AuthCard>
    );
}
