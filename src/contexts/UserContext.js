'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from 'superbase';
import { fetchProfile } from '@/utils/user';
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Function to fetch user session
        const fetchUserSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                fetchProfile(session.user, setUser)
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
                    fetchProfile(session.user, setUser)
                } else {
                    localStorage.removeItem('user');
                }
            }
        );

        return () => {
            listener?.unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
