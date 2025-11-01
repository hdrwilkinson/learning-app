import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
    title: "Atoms/Button",
    component: Button,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["primary", "secondary", "outline", "ghost"],
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
        },
        disabled: {
            control: "boolean",
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        children: "Button",
        variant: "primary",
    },
};

export const Secondary: Story = {
    args: {
        children: "Button",
        variant: "secondary",
    },
};

export const Outline: Story = {
    args: {
        children: "Button",
        variant: "outline",
    },
};

export const Ghost: Story = {
    args: {
        children: "Button",
        variant: "ghost",
    },
};

export const Small: Story = {
    args: {
        children: "Button",
        size: "sm",
    },
};

export const Large: Story = {
    args: {
        children: "Button",
        size: "lg",
    },
};

export const Disabled: Story = {
    args: {
        children: "Button",
        disabled: true,
    },
};
