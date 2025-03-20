
"use client";
// components/ThemeProvider.tsx
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { darkTheme, lightTheme } from '@/styles/stitches';
import { useEffect, useState } from 'react';

const ThemeProvider = ({ children }) => {
    const [mounted, setMounted] = useState(false);

    // Ensure that the component only renders client-side
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div />; // Prevent SSR mismatch by rendering nothing on the first load
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
