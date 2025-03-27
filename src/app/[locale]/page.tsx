"use client";
import styles from "@/app/page.module.css";
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";
import { supabase } from "superbase";
import { Auth } from "@supabase/auth-ui-react";
import { useRouter } from "next/navigation";
import { fetchProfile } from "@/utils/user";
import RegisterSW from "@/components/RegisterSW";
import { checkFirstLogin } from "@/utils/utils";
import Logo from "@/components/logo";
import { Container, FocusContainer } from "@/styles/basic";
import { useTitle } from "@/contexts/TitleContext";
import { useLocale } from "@/app/[locale]/hooks/useLocal";
import ja from "@/../public/locales/ja/supabase.json";
import en from "@/../public/locales/en/supabase.json";
export default function Home() {
  const router = useRouter();
  const currentLocale = useLocale();
  const { setTitle } = useTitle();
  const { user, setUser } = useUser();
  const [localizationVariables, setAuthLang] = useState(en);
  useEffect(() => {
    console.log("Current Locale:", currentLocale);
    console.log("Localization Variables:", localizationVariables);
    setAuthLang(currentLocale === "ja" ? ja : en);
  }, [currentLocale]);
  useEffect(() => {
    setTitle("Login");
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        checkFirstLogin(session?.user);
        console.log("getting profile");
        fetchProfile(session?.user, setUser);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log(user, "user set?");
    if (user) {
      router.push(`/${currentLocale}/profile`);
    }
  }, [user, currentLocale]);

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
            localization={{
              variables: localizationVariables,
            }}
          />
        </FocusContainer>
      </main>
    </Container>
  );
}
