"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

// Define type for the context
interface NavContextType {
  navOpen: boolean;
  setNavOpen: Dispatch<SetStateAction<boolean>>;
}

// Create context with correct type
const NavContext = createContext<NavContextType | undefined>(undefined);

// Define the NavProvider component
export const NavProvider = ({ children }: { children: ReactNode }) => {
  const [navOpen, setNavOpen] = useState<boolean>(false);
  return (
    <NavContext.Provider value={{ navOpen, setNavOpen }}>
      {children}
    </NavContext.Provider>
  );
};

// Custom hook to access the NavContext
export const useNav = () => {
  const context = useContext(NavContext);

  if (!context) {
    throw new Error("useNav must be used within a NavProvider");
  }

  return context;
};
