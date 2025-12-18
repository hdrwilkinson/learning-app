import { AppShell } from "@/components/ui/layout";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AppShell>{children}</AppShell>;
}
