"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import {
    HiCog,
    HiSun,
    HiMoon,
    HiDesktopComputer,
    HiLogout,
    HiUser,
} from "react-icons/hi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/shadcn/dropdown-menu";
import { DropdownElement } from "@/components/ui/atoms/DropdownElement/DropdownElement";
import { Button } from "@/components/ui/shadcn/button";

export function SettingsMenu() {
    const { data: session } = useSession();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/auth/login" });
    };

    if (!mounted) {
        return (
            <Button size="icon" disabled aria-label="Settings">
                <HiCog className="h-5 w-5" />
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" aria-label="Settings">
                    <HiCog className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
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
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
