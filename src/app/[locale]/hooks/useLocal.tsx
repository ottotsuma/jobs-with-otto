"use client";

import { usePathname } from "next/navigation";

export const useLocale = () => {
  const pathname = usePathname();
  const locales = ["en", "ja"]; // Add more if needed

  // Extract locale from pathname, default to 'en'
  const currentLocale = locales.includes(pathname.split("/")[1])
    ? pathname.split("/")[1]
    : "en";

  return currentLocale;
};
