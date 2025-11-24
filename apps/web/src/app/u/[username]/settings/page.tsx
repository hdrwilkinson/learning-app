"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingSchema, OnboardingInput } from "@repo/api";
import {
    updateProfile,
    checkUsernameAvailability,
    deleteAccount,
} from "@/app/actions/auth";
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/shadcn/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/shadcn/dialog";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { HiCheck, HiX } from "react-icons/hi";
import { COUNTRIES } from "@repo/lib";

export default function ProfileSettingsPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
        null
    );
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const form = useForm<OnboardingInput>({
        resolver: zodResolver(OnboardingSchema),
        defaultValues: {
            username: "",
            country: "",
            bio: "",
        },
    });

    const username = form.watch("username");

    // Check route security
    useEffect(() => {
        if (session?.user?.username && params?.username) {
            if (session.user.username !== params.username) {
                router.replace(`/u/${session.user.username}/settings`);
            }
        }
    }, [session, params, router]);

    // Populate form from session data - match onboarding page exactly
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
        // Don't check if empty or same as current
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

            // If username changed, redirect to new URL
            const newUsername = data.username;
            const usernameChanged =
                newUsername && newUsername !== session.user.username;

            // Update session
            await update();

            router.refresh();

            if (usernameChanged) {
                router.push(`/u/${newUsername}/settings`);
            } else {
                // Reset form with new values to reset isDirty
                form.reset({
                    username: data.username || session.user.username || "",
                    country: data.country || "",
                    bio: data.bio || "",
                    dateOfBirth: data.dateOfBirth,
                });
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Something went wrong");
            setIsLoading(false);
        }
    }

    async function handleDeleteAccount() {
        if (!session?.user?.id) return;
        if (deleteConfirmation !== "delete my account") return;

        setIsDeleting(true);
        try {
            const result = await deleteAccount(session.user.id);

            if (result.error) {
                toast.error(result.error);
                setIsDeleting(false);
                return;
            }

            toast.success("Account deleted successfully");
            setIsDeleteDialogOpen(false);

            // Sign out and redirect to home
            await signOut({ callbackUrl: "/" });
        } catch (error) {
            console.error("Delete account error:", error);
            toast.error("Something went wrong");
            setIsDeleting(false);
        }
    }

    if (!session) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="container max-w-2xl py-10">
            <Card>
                <CardHeader>
                    <CardTitle className="font-display-grounded text-2xl font-bold">
                        Profile Settings
                    </CardTitle>
                    <CardDescription>
                        Update your personal information and public profile
                        details.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="username"
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
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell us about yourself"
                                                {...field}
                                                className="resize-none"
                                                rows={4}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={
                                        isLoading ||
                                        isCheckingUsername ||
                                        usernameAvailable === false ||
                                        !form.formState.isDirty
                                    }
                                >
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="mt-6 border-destructive">
                <CardHeader>
                    <CardTitle className="font-display-grounded text-xl font-bold text-destructive">
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                        Once you delete your account, there is no going back.
                        Please be certain.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        Delete Account
                    </Button>
                </CardContent>
            </Card>

            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove all your data from
                            our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <label
                            htmlFor="delete-confirmation"
                            className="text-sm font-medium"
                        >
                            Type <strong>delete my account</strong> to confirm:
                        </label>
                        <Input
                            id="delete-confirmation"
                            type="text"
                            value={deleteConfirmation}
                            onChange={(e) =>
                                setDeleteConfirmation(e.target.value)
                            }
                            placeholder="delete my account"
                            className="mt-2"
                            disabled={isDeleting}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteDialogOpen(false);
                                setDeleteConfirmation("");
                            }}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={
                                deleteConfirmation !== "delete my account" ||
                                isDeleting
                            }
                        >
                            {isDeleting ? "Deleting..." : "Delete Account"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
