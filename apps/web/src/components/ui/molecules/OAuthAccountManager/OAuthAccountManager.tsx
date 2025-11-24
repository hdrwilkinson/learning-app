"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/shadcn/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/shadcn/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/shadcn/alert-dialog";
import { toast } from "sonner";
import { getConnectedAccounts, disconnectAccount } from "@/app/actions/auth";

type Account = {
    id: string;
    provider: string;
    providerAccountId: string;
    type: string;
};

const PROVIDERS = [
    {
        id: "google",
        name: "Google",
        icon: FcGoogle,
        color: "text-blue-600",
    },
    {
        id: "github",
        name: "GitHub",
        icon: FaGithub,
        color: "text-gray-900 dark:text-gray-100",
    },
] as const;

export function OAuthAccountManager() {
    const { data: session, update } = useSession();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [disconnectAccountId, setDisconnectAccountId] = useState<
        string | null
    >(null);
    const [isDisconnecting, setIsDisconnecting] = useState(false);

    const loadAccounts = useCallback(async () => {
        if (!session?.user?.id) return;

        setIsLoading(true);
        try {
            const result = await getConnectedAccounts(session.user.id);
            if (result.error) {
                toast.error(result.error);
            } else if (result.success && result.accounts) {
                setAccounts(result.accounts);
            }
        } catch (error) {
            console.error("Failed to load accounts:", error);
            toast.error("Failed to load connected accounts");
        } finally {
            setIsLoading(false);
        }
    }, [session?.user?.id]);

    useEffect(() => {
        if (session?.user?.id) {
            loadAccounts();
        }
    }, [session?.user?.id, loadAccounts]);

    async function handleConnect(providerId: string) {
        if (!session?.user?.id) return;

        try {
            // Use callbackUrl to return to settings page after OAuth
            await signIn(providerId, {
                callbackUrl: `/users/${session.user.username}/settings`,
            });
        } catch (error) {
            console.error("Failed to connect account:", error);
            toast.error("Failed to connect account");
        }
    }

    async function handleDisconnect() {
        if (!session?.user?.id || !disconnectAccountId) return;

        setIsDisconnecting(true);
        try {
            const result = await disconnectAccount(
                session.user.id,
                disconnectAccountId
            );

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Account disconnected successfully");
                setDisconnectAccountId(null);
                // Reload accounts and update session
                await loadAccounts();
                await update();
            }
        } catch (error) {
            console.error("Failed to disconnect account:", error);
            toast.error("Failed to disconnect account");
        } finally {
            setIsDisconnecting(false);
        }
    }

    function isConnected(providerId: string): boolean {
        return accounts.some((account) => account.provider === providerId);
    }

    function getAccountForProvider(providerId: string): Account | undefined {
        return accounts.find((account) => account.provider === providerId);
    }

    if (!session?.user?.id) {
        return null;
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="font-display-grounded text-2xl font-bold">
                        Connected Accounts
                    </CardTitle>
                    <CardDescription>
                        Manage your OAuth account connections. Connect multiple
                        accounts for easier access.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-3">
                            {PROVIDERS.map((provider) => (
                                <div
                                    key={provider.id}
                                    className="flex items-center justify-between rounded-lg border p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <provider.icon className="h-5 w-5" />
                                        <span className="font-medium">
                                            {provider.name}
                                        </span>
                                    </div>
                                    <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {PROVIDERS.map((provider) => {
                                const connected = isConnected(provider.id);
                                const account = getAccountForProvider(
                                    provider.id
                                );

                                return (
                                    <div
                                        key={provider.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <provider.icon className="h-5 w-5" />
                                            <div>
                                                <div className="font-medium">
                                                    {provider.name}
                                                </div>
                                                {connected && account && (
                                                    <div className="text-sm text-muted-foreground">
                                                        Connected
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {connected ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setDisconnectAccountId(
                                                        account!.id
                                                    )
                                                }
                                            >
                                                Disconnect
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleConnect(provider.id)
                                                }
                                            >
                                                Connect
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <AlertDialog
                open={!!disconnectAccountId}
                onOpenChange={(open) => {
                    if (!open) {
                        setDisconnectAccountId(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Disconnect Account?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to disconnect this account?
                            You will no longer be able to sign in using this
                            provider. Make sure you have another way to sign in
                            before disconnecting.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDisconnecting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDisconnect}
                            disabled={isDisconnecting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDisconnecting
                                ? "Disconnecting..."
                                : "Disconnect"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
