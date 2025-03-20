// contexts/ContextsWrapper.tsx
import { FC, ReactNode } from "react";
import { UserProvider } from "./UserContext";
import { NavProvider } from "./navContext";
import { TitleProvider } from "./TitleContext";
import ThemeProvider from "@/components/ThemeProvider"; // Assuming ThemeProvider is a context too

// Add any other context providers here

type ContextsWrapperProps = {
  children: ReactNode;
};

const ContextsWrapper: FC<ContextsWrapperProps> = ({ children }) => {
  return (
    <UserProvider>
      <NavProvider>
        <TitleProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </TitleProvider>
      </NavProvider>
    </UserProvider>
  );
};

export default ContextsWrapper;
