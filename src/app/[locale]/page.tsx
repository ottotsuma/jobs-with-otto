"use client";
import styles from "@/app/page.module.css";
import { useUser } from "@/contexts/UserContext";
import { useEffect } from "react";
import { supabase } from "superbase";
import { Auth } from "@supabase/auth-ui-react";
import { useRouter } from "next/navigation";
import { fetchProfile } from "@/utils/user";
import RegisterSW from "@/components/RegisterSW";
import { checkFirstLogin } from "@/utils/utils";
import Logo from "@/components/logo";
import { Button, Container, FocusContainer } from "@/styles/basic";
import { useTitle } from "@/contexts/TitleContext";
export default function Home() {
  const router = useRouter();
  const { setTitle } = useTitle();
  const { user, setUser } = useUser();
  useEffect(() => {
    setTitle("Login");
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        checkFirstLogin(session?.user);
        fetchProfile(session?.user, setUser);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/profile");
    }
  }, [user]);

  return (
    <Container>
      <RegisterSW />
      <main className={styles.main}>
        <FocusContainer>
          <Logo />
          <Auth
            supabaseClient={supabase}
            providers={[]}
            socialLayout="horizontal"
            socialButtonSize="xlarge"
          />
        </FocusContainer>
      </main>
      <footer className={styles.footer}>
        <Button onClick={() => router.push("/about")} color="blue">
          about
        </Button>
        <Button onClick={() => router.push("/contact")} color="blue">
          contact
        </Button>
      </footer>
    </Container>
  );
}
