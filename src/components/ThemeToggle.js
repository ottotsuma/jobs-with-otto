// components/ThemeToggle.js
'use client';
import { useTheme } from 'next-themes';

const ThemeToggle = () => {
    const { setTheme, resolvedTheme } = useTheme();

    const toggleTheme = () => {
        const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    return (
        <button onClick={toggleTheme}>
            {resolvedTheme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
    );
};

export default ThemeToggle;
