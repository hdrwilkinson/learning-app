import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
    title: "Atoms/Input",
    component: Input,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: "Enter text...",
    },
};

export const WithLabel: Story = {
    args: {
        label: "Email",
        placeholder: "you@example.com",
    },
};

export const WithError: Story = {
    args: {
        label: "Email",
        placeholder: "you@example.com",
        error: "This field is required",
    },
};

export const WithHelper: Story = {
    args: {
        label: "Password",
        placeholder: "Enter password",
        helperText: "Must be at least 8 characters",
    },
};
