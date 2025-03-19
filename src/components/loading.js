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
    border: "4px solid $gray200",
    borderTopColor: "$blue600",
    animation: `${spin} 1s linear infinite`,
});

const LoadingContainer = styled("div", {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",

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