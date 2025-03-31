"use client";
import { styled, keyframes } from "@stitches/react";
import { ReactNode } from "react";
import { useTheme } from "next-themes";
const slideIn = keyframes({
  from: { transform: "translateX(100%)" },
  to: { transform: "translateX(0)" },
});

const slideOut = keyframes({
  from: { transform: "translateX(0)" },
  to: { transform: "translateX(100%)" },
});

const Overlay = styled("div", {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "flex-end",
  zIndex: 1000,
  transition: "opacity 0.3s ease",
});

const SidebarContainer = styled("div", {
  position: "relative",
  width: "75vw", // 3/4 of the screen
  height: "100vh",
  background: "white",
  boxShadow: "-5px 0px 10px rgba(0, 0, 0, 0.2)",
  animation: `${slideIn} 0.3s ease forwards`,
  overflow: "auto",
  variants: {
    hidden: {
      true: {
        animation: `${slideOut} 0.3s ease forwards`,
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
  top: "15px",
  right: "20px",
  background: "transparent",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
  variants: {
    theme: {
      true: {
        color: "#333",
      },
      false: {
        color: "WhiteSmoke",
      },
    },
  },
});

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode; // Allows any content inside the sidebar
}

const Sidebar = ({ isOpen, onClose, children }: SidebarProps) => {
  const { theme } = useTheme();
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <SidebarContainer
        theme={theme === "dark" ? false : true}
        hidden={!isOpen}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton theme={theme === "dark" ? false : true} onClick={onClose}>
          &times;
        </CloseButton>
        {children}
      </SidebarContainer>
    </Overlay>
  );
};

export default Sidebar;
