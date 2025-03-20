"use client";

import { styled, keyframes } from "@stitches/react";
import { useTheme } from "next-themes";
import { useTitle } from "@/contexts/TitleContext";
import { useNav } from "@/contexts/navContext";
const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
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
        backgroundColor: "#fff",
        color: "#333",
      },
      false: {
        backgroundColor: "#1C1C1C",
        color: "WhiteSmoke",
      },
    },
  },
});

const MenuButton = styled("button", {
  background: "none",
  border: "none",
  fontSize: "1.5rem",
  cursor: "pointer",
  display: "none", // Show only on mobile
  "@media (max-width: 1023px)": {
    display: "block",
  },
});

const CloseButton = styled("button", {
  position: "absolute",
  top: "1rem",
  right: "1rem",
  background: "none",
  border: "none",
  fontSize: "1.5rem",
  cursor: "pointer",
  display: "none", // Only show on mobile
  "@media (max-width: 1023px)": {
    display: "block",
  },
});

const Title = () => {
  const { navOpen, setNavOpen } = useNav();
  const { title } = useTitle();
  const { theme } = useTheme();
  return (
    <LoadingContainer theme={theme === "dark" ? false : true}>
      {!navOpen && <MenuButton onClick={() => setNavOpen(true)}>☰</MenuButton>}
      <h1>{title}</h1>
    </LoadingContainer>
  );
};

export default Title;
