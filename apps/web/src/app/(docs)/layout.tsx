export default function DocsRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // No AppShell - docs get their own full-page layout via Nextra
    return <>{children}</>;
}
