'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from 'superbase';
import { fetchProfile } from '@/utils/user';
import { User as UserType } from "@/types/users";

// Define UserContextType interface
interface UserContextType {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Define the UserProvider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        // Function to fetch user session
        const fetchUserSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                fetchProfile(session.user, setUser);
                localStorage.setItem('user', JSON.stringify(session.user));
            } else {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            }
        };

        // Ensure this runs only on the client side
        if (typeof window !== 'undefined') {
            fetchUserSession();
        }

        // Listen for changes in auth state
        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session?.user) {
                    fetchProfile(session.user, setUser);
                } else {
                    localStorage.removeItem('user');
                }
            }
        );

        // Type the listener to ensure the subscription property is used
        const typedListener = listener as { subscription: { unsubscribe: () => void } };

        return () => {
            typedListener.subscription?.unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to access the UserContext
export const useUser = () => {
    const context = useContext(UserContext);

    // Check if context is undefined, which means it's used outside of the provider
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }

    return context;
};
