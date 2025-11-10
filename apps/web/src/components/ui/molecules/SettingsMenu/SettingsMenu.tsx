"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { HiCog, HiSun, HiMoon, HiDesktopComputer } from "react-icons/hi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    IconButton,
    DropdownElement,
} from "@/components/ui";

export function SettingsMenu() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <IconButton aria-label="Settings" disabled>
                <HiCog className="h-5 w-5" />
            </IconButton>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <IconButton aria-label="Settings">
                    <HiCog className="h-5 w-5" />
                </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(value) => setTheme(value)}
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
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
