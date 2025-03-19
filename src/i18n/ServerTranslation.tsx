"use client";

import { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./client-i18n"; // Create this client instance

export default function ServerTranslation({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  i18n.changeLanguage(locale); // Ensure locale is set

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
