// components/ThemeToggle.js
'use client';
import { useTheme } from 'next-themes';
import { Button } from '@/styles/basic';
const ThemeToggle = () => {
    const { setTheme, resolvedTheme } = useTheme();

    const toggleTheme = () => {
        const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    return (
        <Button style={{ fontSize: "1rem" }} onClick={toggleTheme}>
            {resolvedTheme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </Button>
    );
};

export default ThemeToggle;
