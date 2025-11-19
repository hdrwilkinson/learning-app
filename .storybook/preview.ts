import type { Preview } from "@storybook/react";
import "../apps/web/src/styles/globals.css";
import "./fonts.css";
import { useThemeProviderDecorator } from "./ThemeProvider";

const preview: Preview = {
    decorators: [useThemeProviderDecorator],
    globalTypes: {
        theme: {
            name: "Theme",
            description: "Global theme for components",
            defaultValue: "light",
            toolbar: {
                icon: "circlehollow",
                // Array of plain string values or MenuItem shape (see below)
                items: [
                    { value: "light", icon: "sun", title: "Light" },
                    { value: "dark", icon: "moon", title: "Dark" },
                    {
                        value: "split",
                        icon: "sidebyside",
                        title: "Side-by-Side",
                    },
                ],
                // Property that specifies if the name of the item will be displayed
                showName: true,
            },
        },
    },
    parameters: {
        layout: "fullscreen",
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        backgrounds: {
            disable: true, // Disable background switcher as we handle it in decorator
        },
        docs: {
            story: {
                inline: true, // Render stories inline to ensure they share the main Docs context
                height: "400px", // Default height for the container in Docs
            },
        },
    },
};

export default preview;
