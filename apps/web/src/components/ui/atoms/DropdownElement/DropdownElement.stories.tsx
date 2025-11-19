import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DropdownElement } from "./DropdownElement";
import { HiHome, HiMoon } from "react-icons/hi";
import * as DM from "../../shadcn/dropdown-menu";

const meta: Meta<typeof DropdownElement> = {
    title: "Web/Atoms/DropdownElement",
    component: DropdownElement,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DropdownElement>;

export const Default: Story = {
    args: {
        label: "Home",
        icon: <HiHome className="w-4 h-4" />,
        selected: false,
    },
};

export const Selected: Story = {
    args: {
        label: "Home",
        icon: <HiHome className="w-4 h-4" />,
        selected: true,
    },
    render: (args) => (
        <div className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground w-56 border">
            <DropdownElement {...args} />
            <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-2 w-2 fill-current"
                >
                    <circle cx="12" cy="12" r="10" />
                </svg>
            </span>
        </div>
    ),
};

export const Disabled: Story = {
    args: {
        label: "Home",
        icon: <HiHome className="w-4 h-4" />,
        disabled: true,
    },
};

// Demonstrates DropdownElement inside a DropdownMenu with a selectable radio dot indicator
export const InDropdownMenu: StoryObj<{
    selectedKey: "home" | "other";
}> = {
    args: {
        selectedKey: "home",
    },
    argTypes: {
        selectedKey: {
            control: {
                type: "inline-radio",
                options: ["home", "other"],
            },
        },
    },
    render: (args) => {
        return (
            <DM.DropdownMenu>
                <DM.DropdownMenuTrigger asChild>
                    <button className="px-3 py-2 rounded-md border text-sm">
                        Open
                    </button>
                </DM.DropdownMenuTrigger>
                <DM.DropdownMenuContent className="w-56">
                    <DM.DropdownMenuRadioGroup value={args.selectedKey}>
                        <DM.DropdownMenuRadioItem
                            value="home"
                            className="pl-2 pr-8 [&>span]:left-auto [&>span]:right-2"
                        >
                            <DropdownElement
                                icon={<HiHome className="h-4 w-4" />}
                                label="Home"
                            />
                        </DM.DropdownMenuRadioItem>
                        <DM.DropdownMenuRadioItem
                            value="other"
                            className="pl-2 pr-8 [&>span]:left-auto [&>span]:right-2"
                        >
                            <DropdownElement
                                icon={<HiMoon className="h-4 w-4" />}
                                label="Other"
                            />
                        </DM.DropdownMenuRadioItem>
                    </DM.DropdownMenuRadioGroup>
                </DM.DropdownMenuContent>
            </DM.DropdownMenu>
        );
    },
};
