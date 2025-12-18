"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import {
    HiSun,
    HiMoon,
    HiDesktopComputer,
    HiLogout,
    HiUser,
} from "react-icons/hi";
import {
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/shadcn/dropdown-menu";
import { DropdownElement } from "@/components/ui/atoms/DropdownElement/DropdownElement";

export interface BaseSettingsContentProps {
    /** Whether the component has mounted (for hydration) */
    mounted?: boolean;
}

/**
 * BaseSettingsContent Component
 *
 * Reusable dropdown menu content for settings.
 * Includes Theme selection, Profile link, and Logout.
 * Must be used inside a DropdownMenuContent wrapper.
 */
export function BaseSettingsContent({
    mounted = true,
}: BaseSettingsContentProps) {
    const { data: session } = useSession();
    const { theme, setTheme } = useTheme();

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/auth/login" });
    };

    if (!mounted) {
        return null;
    }

    return (
        <>
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value: string) =>
                    setTheme(value as "light" | "dark" | "system")
                }
            >
                <DropdownMenuRadioItem
                    value="light"
                    className="pl-2 pr-8 [&>span]:left-auto [&>span]:right-2"
                >
                    <DropdownElement
                        icon={<HiSun className="h-4 w-4" />}
                        label="Light"
                        selected={theme === "light"}
                    />
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                    value="dark"
                    className="pl-2 pr-8 [&>span]:left-auto [&>span]:right-2"
                >
                    <DropdownElement
                        icon={<HiMoon className="h-4 w-4" />}
                        label="Dark"
                        selected={theme === "dark"}
                    />
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                    value="system"
                    className="pl-2 pr-8 [&>span]:left-auto [&>span]:right-2"
                >
                    <DropdownElement
                        icon={<HiDesktopComputer className="h-4 w-4" />}
                        label="System"
                        selected={theme === "system"}
                    />
                </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            {session?.user?.username && (
                <>
                    <DropdownMenuItem asChild>
                        <Link
                            href={`/users/${session.user.username}/settings`}
                            className="pl-2"
                        >
                            <DropdownElement
                                icon={<HiUser className="h-4 w-4" />}
                                label="Profile"
                            />
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                </>
            )}
            <DropdownMenuItem onClick={handleLogout} className="pl-2">
                <DropdownElement
                    icon={<HiLogout className="h-4 w-4" />}
                    label="Log out"
                />
            </DropdownMenuItem>
        </>
    );
}
