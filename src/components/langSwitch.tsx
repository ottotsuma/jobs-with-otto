"use client";

import { useRouter, usePathname } from "next/navigation";
import { styled } from "@stitches/react";
import Select from "react-select"; // Import react-select
import { useTheme } from "next-themes";
import i18n from "@/i18n/client-i18n";
import { useState } from "react";
import { useLocale } from "@/app/[locale]/hooks/useLocal";
// Styled components using Stitches
const Wrapper = styled("div", {
  display: "flex",
  justifyContent: "center", // Center the dropdown
  // padding: "10px",
  variants: {
    theme: {
      true: {
        backgroundColor: "#fff",
        color: "#333",
      },
      false: {
        backgroundColor: "#1C1C1C",
        color: "WhiteSmoke",
      },
    },
  },
});

const customSelectStyles = (theme) => ({
  container: (base, state) => ({
    ...base,
    width: "100%",
  }),
  control: (base, state) => ({
    ...base,
    backgroundColor: theme === "dark" ? "#333" : "#fff", // Dark mode vs light mode
    color: theme === "dark" ? "#fff" : "#333",
    borderColor: state.isFocused
      ? theme === "dark"
        ? "#666"
        : "#0070f3"
      : "#ccc", // Border color
    borderRadius: "4px",
    padding: "5px 10px",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: theme === "dark" ? "#444" : "#fff", // Dark menu background
    borderRadius: "4px",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? theme === "dark"
        ? "#0070f3"
        : "#0070f3"
      : "transparent", // Highlight on focus
    color: state.isFocused ? "#fff" : theme === "dark" ? "#ccc" : "#333", // Text color
    padding: "10px",
  }),
  singleValue: (base) => ({
    ...base,
    color: theme === "dark" ? "#fff" : "#333", // Selected value color
  }),
  placeholder: (base) => ({
    ...base,
    color: theme === "dark" ? "#aaa" : "#aaa", // Placeholder color
  }),
});

const LanguageSwitcher = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const locales = ["en", "ja"]; // Supported locales
  const currentLocale = useLocale();
  // Safe access for currentLocale, fallback to 'en' if not found
  // const currentLocale = pathname.split("/")[1] || "en"; // Defaults to 'en' if no locale in path

  const languages = locales.map((l) => {
    return {
      value: l,
      label: new Intl.DisplayNames([l], { type: "language" }).of(l),
    };
  });

  const [selectedLanguage, setSelectedLanguage] = useState(
    languages.find((lang) => lang.value === currentLocale)
  );

  const handleLanguageChange = (selectedOption) => {
    const newLocale = selectedOption.value;
    setSelectedLanguage(languages.find((lang) => lang.value === newLocale));
    i18n.changeLanguage(newLocale);
    router.push(`/${newLocale}${pathname.substring(currentLocale.length + 1)}`);
  };

  return (
    <Wrapper theme={theme === "dark" ? false : true}>
      <Select
        value={selectedLanguage || null} // Set the default value safely
        onChange={handleLanguageChange} // Handle the change
        options={languages} // Provide options for the dropdown
        getOptionLabel={(e) => e.label} // Display the label of each option
        getOptionValue={(e) => e.value} // Set the value for each option
        isSearchable={true} // Enable search functionality
        placeholder="Select a language" // Placeholder text
        styles={customSelectStyles(theme)} // Apply the custom styles
      />
    </Wrapper>
  );
};

export default LanguageSwitcher;
