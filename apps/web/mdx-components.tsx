import { useMDXComponents as getDocsMDXComponents } from "nextra-theme-docs";
import type { MDXComponents } from "mdx/types";

// Get Nextra theme docs MDX components (includes wrapper for sidebar layout)
const docsComponents = getDocsMDXComponents();

// Export the useMDXComponents function as required by Next.js
export function useMDXComponents(components?: MDXComponents): MDXComponents {
    return {
        ...docsComponents,
        ...components,
    };
}
