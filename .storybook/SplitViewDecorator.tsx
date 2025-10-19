import type { Decorator } from '@storybook/react';
import { ThemeProvider } from 'next-themes';
import React from 'react';

export const SplitViewDecorator: Decorator = (StoryFn, context) => {
    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 2rem)', width: 'calc(100vw - 2rem)' }}>
            {/* Light Theme Side */}
            <div style={{ flex: 1, height: '100%' }}>
                <ThemeProvider forcedTheme="light" attribute="data-theme" enableSystem={false}>
                    <div
                        data-theme="light"
                        style={{
                            background: 'var(--background)',
                            color: 'var(--foreground)',
                            height: '100%',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {StoryFn(context)}
                    </div>
                </ThemeProvider>
            </div>

            {/* Dark Theme Side */}
            <div style={{ flex: 1, height: '100%' }}>
                <ThemeProvider forcedTheme="dark" attribute="data-theme" enableSystem={false}>
                    <div
                        data-theme="dark"
                        style={{
                            background: 'var(--background)',
                            color: 'var(--foreground)',
                            height: '100%',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {StoryFn(context)}
                    </div>
                </ThemeProvider>
            </div>
        </div>
    );
}; 