import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
    logo: (
        <span style={{ fontWeight: 700, fontSize: "1.25rem" }}>
            <span style={{ color: "hsl(262 83% 58%)" }}>Cognia</span>
            <span
                style={{ marginLeft: "0.5rem", fontWeight: 400, opacity: 0.7 }}
            >
                Docs
            </span>
        </span>
    ),
    project: {
        link: "https://github.com/hdrwilkinson/the-learning-app",
    },
    docsRepositoryBase:
        "https://github.com/hdrwilkinson/the-learning-app/tree/main/apps/web/pages/docs",
    footer: {
        text: (
            <span>
                © {new Date().getFullYear()}{" "}
                <span style={{ fontWeight: 600 }}>Cognia</span>
                {" · "}Master anything, on schedule.
            </span>
        ),
    },
    sidebar: {
        defaultMenuCollapseLevel: 1,
        toggleButton: true,
    },
    toc: {
        backToTop: true,
    },
    useNextSeoProps() {
        return {
            titleTemplate: "%s – Cognia Docs",
        };
    },
    head: (
        <>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <meta property="og:title" content="Cognia Documentation" />
            <meta
                property="og:description"
                content="Documentation for the AI-powered learning platform"
            />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossOrigin="anonymous"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap"
                rel="stylesheet"
            />
        </>
    ),
    // Purple primary color (hue 262)
    primaryHue: 262,
    primarySaturation: 83,
    darkMode: true,
    nextThemes: {
        defaultTheme: "system",
    },
    // Custom banner (optional - remove if not wanted)
    // banner: {
    //   key: 'docs-beta',
    //   text: '🚧 Documentation is in progress. Some sections may be incomplete.',
    // },
};

export default config;
