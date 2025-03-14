'use client';
import styles from "./page.module.css";
import { useUser } from '@/contexts/UserContext';
import { useEffect } from 'react';
import { supabase } from 'superbase';
import { Auth } from '@supabase/auth-ui-react';
import { useRouter } from "next/navigation";
import {fetchProfile} from '@/utils/user';
import {checkFirstLogin} from '@/utils/utils';
export default function Home() {
  const router = useRouter();
  const { user, setUser } = useUser();
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if(session?.user) {
        checkFirstLogin(session?.user)
        fetchProfile(session?.user, setUser);
      }
    });
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if(user) {
      router.push('/profile');
    }
  }, [user]);
  
  return (
    <div className={styles.page}>
        <Auth
            supabaseClient={supabase}
            providers={[]} 
            socialLayout="horizontal"
            socialButtonSize="xlarge"
        />
        
      <main className={styles.main}>
      
      </main>
      <footer className={styles.footer}>
        
      </footer>
    </div>
  );
}
