import { Layout, Navbar } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import type { ReactNode } from "react";
import "nextra-theme-docs/style.css";

const Logo = () => (
    <span style={{ fontWeight: 700, fontSize: "1.25rem" }}>
        <span style={{ color: "hsl(262 83% 58%)" }}>Cognia</span>
        <span
            style={{
                marginLeft: "0.5rem",
                fontWeight: 400,
                opacity: 0.7,
            }}
        >
            Docs
        </span>
    </span>
);

const Footer = () => (
    <span>
        © {new Date().getFullYear()}{" "}
        <span style={{ fontWeight: 600 }}>Cognia</span>
        {" · "}Master anything, on schedule.
    </span>
);

export default async function DocsLayout({
    children,
}: {
    children: ReactNode;
}) {
    const pageMap = await getPageMap("/docs");

    return (
        <Layout
            pageMap={pageMap}
            navbar={
                <Navbar
                    logo={<Logo />}
                    projectLink="https://github.com/hdrwilkinson/the-learning-app"
                />
            }
            docsRepositoryBase="https://github.com/hdrwilkinson/the-learning-app/tree/main/apps/web/src/app/docs"
            sidebar={{
                defaultMenuCollapseLevel: 2,
                defaultOpen: true,
                toggleButton: true,
            }}
            toc={{ backToTop: true }}
            footer={<Footer />}
        >
            {children}
        </Layout>
    );
}
