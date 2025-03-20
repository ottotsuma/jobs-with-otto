"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "superbase";
import { fetchProfile } from "@/utils/user";
import { User as UserType } from "@/types/users";

// Define UserContextType interface
interface UserContextType {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  userLoading: boolean;
}

// Create the context
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  userLoading: true,
});

// Define the UserProvider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  useEffect(() => {
    // Function to fetch user session
    const fetchUserSession = async () => {
      setUserLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user, setUser);
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(session.user));
        }
      } else {
        if (typeof window !== "undefined") {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      }
      setUserLoading(false);
    };

    fetchUserSession();

    // Listen for changes in auth state
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchProfile(session.user, setUser);
        } else {
          if (typeof window !== "undefined") {
            localStorage.removeItem("user");
          }
        }
      }
    );

    // Type the listener to ensure the subscription property is used
    const typedListener = listener as {
      subscription: { unsubscribe: () => void };
    };

    return () => {
      typedListener.subscription?.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, userLoading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the UserContext
export const useUser = () => {
  const context = useContext(UserContext);

  // Check if context is undefined, which means it's used outside of the provider
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

// export default UserProvider;
