import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";
import { SettingsMenu } from "@/components/ui/molecules/SettingsMenu";

export const metadata: Metadata = {
    title: "Learning App",
    description: "GenAI-powered learning platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <div className="fixed right-4 top-4 z-50">
                        <SettingsMenu />
                    </div>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
