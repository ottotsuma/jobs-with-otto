import { createStitches } from "@stitches/react";

export const { styled, keyframes, globalCss, theme } = createStitches({
    theme: {
        colors: {
            blue600: "#2563eb",
            gray200: "#e5e7eb",
            gray300: "#d1d5db",
            white: "#ffffff",
            black: "#000000",
        },
        radii: {
            rounded: "4px",
        },
        space: {
            small: "8px 16px",
        },
    },
});

export const globalStyles = globalCss({
    "*": {
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
    },
    body: {
        fontFamily: "Arial, sans-serif",
    },
});
