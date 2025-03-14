// components/ThemeProvider.js
'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { darkTheme, lightTheme } from '@/styles/stitches';

const ThemeProvider = ({ children }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // If the component hasn't mounted yet, render nothing to prevent hydration mismatch
    if (!mounted) {
        return null;
    }

    return (
        <NextThemesProvider
            defaultTheme="system"
            attribute="class"
            value={{
                light: lightTheme.className,
                dark: darkTheme.className,
            }}
        >
            {children}
        </NextThemesProvider>
    );
};

export default ThemeProvider;
