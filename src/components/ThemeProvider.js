// components/ThemeProvider.tsx
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { darkTheme, lightTheme } from '@/styles/stitches';

const ThemeProvider = ({ children }) => {

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
