'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from 'superbase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check active session and set user
        const session = supabase.auth.getSession();
        setUser(session?.user ?? null);

        // Listen for changes in auth state
        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ?? null);
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
