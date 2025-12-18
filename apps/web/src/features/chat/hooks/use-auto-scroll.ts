"use client";

/**
 * useAutoScroll Hook
 *
 * Automatically scrolls to the bottom of a container when messages change.
 */

import { useRef, useEffect } from "react";

/**
 * Hook to automatically scroll to the bottom when dependencies change.
 * Returns a ref to attach to the scroll target element.
 *
 * @param deps - Dependencies that trigger scroll (typically messages array)
 * @returns Ref to attach to the element that should be scrolled into view
 */
export function useAutoScroll<T>(deps: T[]) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [deps]);

    return scrollRef;
}
