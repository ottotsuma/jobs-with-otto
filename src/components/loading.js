"use client";

import { styled, keyframes } from "@stitches/react";
import { useTheme } from 'next-themes';
const spin = keyframes({
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" }
});

const Loader = styled("div", {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "4px solid #e0e0e0", // Light gray border
    borderTopColor: "#007bff", // Blue top border
    animation: `${spin} 1s linear infinite`,
});


const LoadingContainer = styled("div", {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,

    variants: {
        theme: {
            true: {
                backgroundColor: '#fff',
                color: '#333',
            },
            false: {
                backgroundColor: '#1C1C1C',
                color: "WhiteSmoke"
            }
        }
    },
});

const Loading = () => {
    const { theme } = useTheme();
    return (
        <LoadingContainer theme={theme === "dark" ? false : true}>
            <Loader />
        </LoadingContainer>
    );
};

export default Loading; 