import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/../public/locales/en/common.json";
import ja from "@/../public/locales/ja/common.json";

i18n.use(initReactI18next).init({
    resources: {
        en: { common: en },
        ja: { common: ja },
    },
    lng: "en", // Default language
    fallbackLng: "en",
    interpolation: { escapeValue: false },
});

export default i18n;
