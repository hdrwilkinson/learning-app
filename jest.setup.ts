import '@testing-library/jest-dom';
import React from 'react';

// Mock react-markdown and related packages
jest.mock('react-markdown', () => {
    return function MockReactMarkdown({ children, ...props }: { children: string;[key: string]: unknown }) {
        return React.createElement('div', { 'data-testid': 'react-markdown', ...props }, children);
    };
});

// Enhanced ResizeObserver mock that works with both global and local usage
global.ResizeObserver = class ResizeObserver {
    private callback: ResizeObserverCallback;
    private observedElements: Set<Element> = new Set();

    constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
    }

    observe(element: Element): void {
        this.observedElements.add(element);
        // Only auto-trigger if no custom mock is being used
        if (!(global as typeof globalThis & { __RESIZE_OBSERVER_TEST_MODE__?: boolean }).__RESIZE_OBSERVER_TEST_MODE__) {
            const mockEntry: ResizeObserverEntry = {
                target: element,
                contentRect: {
                    x: 0,
                    y: 0,
                    width: 800, // Default width that matches useContainerWidth initial state
                    height: 600,
                    top: 0,
                    right: 800,
                    bottom: 600,
                    left: 0,
                    toJSON: () => ({})
                },
                borderBoxSize: [] as ResizeObserverSize[],
                contentBoxSize: [] as ResizeObserverSize[],
                devicePixelContentBoxSize: [] as ResizeObserverSize[]
            };

            // Call the callback with the mock entry
            setTimeout(() => {
                this.callback([mockEntry], this);
            }, 0);
        }
    }

    unobserve(element: Element): void {
        this.observedElements.delete(element);
    }

    disconnect(): void {
        this.observedElements.clear();
    }
};
