"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "superbase";
import { styled } from "@stitches/react";
import { useState, useEffect } from "react";
import { Button } from "@/styles/basic";
import { useTheme } from "next-themes";
import { useTranslation } from "next-i18next";
import { useLocale } from "@/app/[locale]/hooks/useLocal";
// Styled components using Stitches.js
const Nav = styled("div", {
  backgroundColor: "#fff",
  padding: "1rem",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  minHeight: "100vh",
  height: "100vh", // Ensure it fills the viewport height
  minWidth: "250px",
  transition: "transform 0.3s ease-in-out",
  zIndex: 1000,
  position: "fixed", // Ensures it stays in place
  right: 0, // Align to the right
  top: 0,
  overflowY: "auto", // Enables scrolling
  maxHeight: "100vh", // Prevents the sidebar from expanding beyond the screen
  variants: {
    mobile: {
      true: {
        width: "100%", // Full screen on mobile
        transform: "translateX(0)",
      },
      false: {
        minWidth: "200px",
        width: "15%",
      },
    },
    hidden: {
      true: {
        transform: "translateX(100%)", // Move it completely out of view to the right
      },
      false: {
        transform: "translateX(0)", // Bring it back into view
      },
    },
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

const MenuButton = styled("button", {
  position: "fixed",
  top: "1rem",
  left: "1rem",
  background: "none",
  border: "none",
  fontSize: "1.5rem",
  cursor: "pointer",
  display: "none", // Show only on mobile
  "@media (max-width: 1023px)": {
    display: "block",
  },
});

const List = styled("ul", {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

const ListItem = styled("li", {
  fontSize: "1.2rem",
  display: "flex",
  flexDirection: "column", // aligns items to the middle.
});

const StyledLink = styled(Link, {
  textDecoration: "none",
  fontWeight: "500",
  "&:hover": {
    color: "#007bff",
  },
});

const ViewDetails = ({ isOpen = false, data = {}, close = () => {} }) => {
  const { t, i18n } = useTranslation("common");
  const { theme } = useTheme();
  const { user } = useUser();
  const router = useRouter();
  const currentLocale = useLocale();
  // Detect screen size changes
  useEffect(() => {
    console.log("data for view", data, isOpen);
  }, []);

  return (
    <>
      {/* Sidebar */}
      <Nav theme={theme === "dark" ? false : true} hidden={!isOpen}>
        <List>
          {data &&
            Object.keys(data).map((key) => (
              <ListItem key={key}>{key}</ListItem>
            ))}
        </List>
        <CloseButton onClick={() => close()}>✖</CloseButton>
      </Nav>
    </>
  );
};

export default ViewDetails;
