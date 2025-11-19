import type { Meta, StoryObj } from "@storybook/react";
import { SettingsMenu } from "./SettingsMenu";
import { ThemeProvider } from "next-themes";

const meta: Meta<typeof SettingsMenu> = {
    title: "Web/Molecules/SettingsMenu",
    component: SettingsMenu,
    tags: ["autodocs"],
    argTypes: {
        // Injecting a custom prop for the story
        defaultTheme: {
            control: "select",
            options: ["light", "dark", "system"],
            description: "Sets the default selected theme",
        },
    },
};

export default meta;
type Story = StoryObj<
    React.ComponentProps<typeof SettingsMenu> & { defaultTheme: string }
>;

export const Default: Story = {
    args: {
        // Storybook-only arg to control initial theme; not part of component props
        defaultTheme: "light",
    },
    render: (args) => {
        // Reading Storybook-only arg; not part of component props
        const { defaultTheme } = args;
        return (
            <ThemeProvider
                attribute="class"
                defaultTheme={defaultTheme}
                forcedTheme={defaultTheme}
            >
                <div className="flex justify-end p-4">
                    <SettingsMenu />
                </div>
            </ThemeProvider>
        );
    },
};
