import type { Metadata } from "next";
import { Inter, Inter_Tight, Space_Grotesk, Fira_Code } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const interTight = Inter_Tight({
    subsets: ["latin"],
    variable: "--font-display",
    display: "swap",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-display-fun",
    display: "swap",
});

const firaCode = Fira_Code({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Cognia - Master anything, on schedule",
    description:
        "GenAI-powered learning platform designed to help you master subjects through structured, personalized pathways.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${interTight.variable} ${spaceGrotesk.variable} ${firaCode.variable} font-sans antialiased`}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
