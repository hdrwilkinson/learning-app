import type { Meta, StoryObj } from "@storybook/react";
import { SettingsMenu } from "./SettingsMenu";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

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

// Mock router for App Directory
const mockRouter = {
    back: () => {},
    forward: () => {},
    push: () => {},
    replace: () => {},
    refresh: () => {},
    prefetch: () => {},
};

export const Default: Story = {
    args: {
        // Storybook-only arg to control initial theme; not part of component props
        defaultTheme: "light",
    },
    render: (args) => {
        // Reading Storybook-only arg; not part of component props
        const { defaultTheme } = args;
        return (
            <AppRouterContext.Provider value={mockRouter}>
                <SessionProvider session={null}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme={defaultTheme}
                        forcedTheme={defaultTheme}
                    >
                        <div className="flex justify-end p-4">
                            <SettingsMenu />
                        </div>
                    </ThemeProvider>
                </SessionProvider>
            </AppRouterContext.Provider>
        );
    },
};

export const Authenticated: Story = {
    args: {
        defaultTheme: "light",
    },
    render: (args) => {
        const { defaultTheme } = args;
        const mockSession = {
            user: {
                id: "123",
                name: "Test User",
                email: "test@example.com",
                username: "testuser",
                image: "https://github.com/shadcn.png",
            },
            expires: "9999-12-31T23:59:59.999Z",
        };

        return (
            <AppRouterContext.Provider value={mockRouter}>
                <SessionProvider session={mockSession}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme={defaultTheme}
                        forcedTheme={defaultTheme}
                    >
                        <div className="flex justify-end p-4">
                            <SettingsMenu />
                        </div>
                    </ThemeProvider>
                </SessionProvider>
            </AppRouterContext.Provider>
        );
    },
};
