import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/navbar";
import { dir } from "i18next";
// import { languages } from "@/i18n/settings";
import ServerTranslation from "@/i18n/ServerTranslation";
import Title from "@/components/Title";
import ContextsWrapper from "@/contexts/ContextsWrapper";
// import { globalStyles } from "@/styles/theme";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Jobs With Otto - Find Your Next Job",
  description:
    "Free job board by Otto. Find full-time, part-time, contract, and gig work.",
  keywords: [
    "jobs",
    "careers",
    "job board",
    "employment",
    "Otto jobs",
    "full-time jobs",
    "part-time jobs",
    "contract work",
    "gig jobs",
    "freelance jobs",
  ],
  openGraph: {
    title: "Jobs With Otto",
    description: "Find full-time, part-time, contract, and gig work easily.",
    url: "https://jobswithotto.netlify.app/",
    siteName: "Jobs With Otto",
    images: [
      {
        url: "https://jobswithotto.netlify.app//og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jobs With Otto",
    description: "Browse job opportunities easily with Otto.",
    images: ["https://jobswithotto.netlify.app//twitter-image.jpg"], // Replace with actual image
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  // PWA meta tags and manifest link:
  manifest: "/manifest.json", // Link to the PWA manifest
};
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const awaitedParams = await params;
  const { locale } = awaitedParams;
  return (
    <html lang={locale} dir={dir(locale)}>
      <head>
        {/* Add PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ContextsWrapper>
          <ServerTranslation locale={locale}>
            <div
              style={{
                display: "flex",
                // minWidth: "100vw",
                minHeight: "100vh",
              }}
            >
              <Navbar />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1, // Takes up all remaining space
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Title />
                </div>
                {/* Main Content (Children) - Fills Remaining Space */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1, // Takes up all available space
                    overflowY: "auto", // Allows scrolling if content is too long
                  }}
                >
                  {children}
                </div>
              </div>
            </div>
          </ServerTranslation>
        </ContextsWrapper>
      </body>
    </html>
  );
}
