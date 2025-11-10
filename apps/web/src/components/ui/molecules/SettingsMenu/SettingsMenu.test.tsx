import { render, screen } from "@testing-library/react";
import { SettingsMenu } from "./SettingsMenu";
import { ThemeProvider } from "next-themes";

// Mock next-themes to avoid hydration issues in tests
jest.mock("next-themes", () => ({
    ThemeProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="theme-provider">{children}</div>
    ),
    useTheme: () => ({
        theme: "system",
        setTheme: jest.fn(),
    }),
}));

describe("SettingsMenu", () => {
    it("renders settings button", () => {
        render(
            <ThemeProvider>
                <SettingsMenu />
            </ThemeProvider>
        );

        const button = screen.getByLabelText("Settings");
        expect(button).toBeInTheDocument();
    });

    it("renders button when mounted", () => {
        render(
            <ThemeProvider>
                <SettingsMenu />
            </ThemeProvider>
        );

        // The component will render button after mounting
        const button = screen.getByLabelText("Settings");
        expect(button).toBeInTheDocument();
    });
});
