"use client";

import { SecondaryNav } from "./SecondaryNav";

interface AccessorySectionProps {
    children?: React.ReactNode;
}

export function AccessorySection({ children }: AccessorySectionProps) {
    return (
        <aside className="hidden lg:flex lg:flex-col lg:fixed lg:right-0 lg:top-0 lg:w-80 lg:h-screen">
            {/* Secondary Navigation at the top */}
            <div className="lg:z-40 lg:bg-background">
                <SecondaryNav />
            </div>

            {/* Accessory Content - hidden on tablet/mobile */}
            <div className="hidden lg:block flex-1 overflow-y-auto">
                {children}
            </div>
        </aside>
    );
}
