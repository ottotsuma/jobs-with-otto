'use client';
import Image from "next/image";
import styles from "./page.module.css";
import { useUser } from '@/contexts/UserContext';
import { useEffect, useState } from 'react';
import { supabase } from 'superbase';
import { Auth } from '@supabase/auth-ui-react';
import Navbar from '@/components/navbar';
export default function Home() {
  const { user, setUser } = useUser();
  const [applicant_profile, setApplicant_profile] = useState({});
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
    });

    return () => {
        listener?.unsubscribe();
    };
}, [setUser]);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('applicant_profiles')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching data:', error);
        } else {
          setApplicant_profile(data);
        }
      };

      fetchProfile();
    }
    console.log(user, 'user')
  }, [user]);
  async function handleSignOut () {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      //  router.push('/');
    }
  };
  return (
    <div className={styles.page}>
      <Navbar />
        <Auth
            supabaseClient={supabase}
            providers={['google', 'github']} // Add desired providers
            socialLayout="horizontal"
            socialButtonSize="xlarge"
        />
        
      <main className={styles.main}>
      {user?.id && <button onClick={handleSignOut}>Sign Out</button>}
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>src/app/page.tsx</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
