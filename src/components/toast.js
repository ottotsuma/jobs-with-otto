'use client';
import { useState, useEffect } from "react";
import { createStitches } from "@stitches/react";

const { styled } = createStitches({
    theme: {
        colors: {
            black: "#000",
            white: "#fff",
            green: "#4CAF50",
        },
    },
});

const ToastContainer = styled("div", {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "$green",
    color: "$white",
    padding: "12px 16px",
    borderRadius: "6px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    opacity: 0.9,
    transition: "opacity 0.3s ease",
});

export default function Toast({ message, show, onClose }) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 1000); // Hide after 1 sec
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return show ? <ToastContainer>{message}</ToastContainer> : null;
}
