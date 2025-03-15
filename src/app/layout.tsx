import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from '@/contexts/UserContext';
import Navbar from '@/components/navbar';
import ThemeProvider from '@/components/ThemeProvider';
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
  description: "Free job board by Otto. Find full-time, part-time, contract, and gig work.",
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
    "freelance jobs"
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
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <UserProvider>
          <ThemeProvider>
            <div style={{display:'flex', minWidth: '100vw', minHeight: '100vh'}}>
              <Navbar />
              <div style={{display: 'flex' , flexDirection: 'column', justifyContent: "space-between"}}>
                {children}
              </div>
            </div>
        </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
