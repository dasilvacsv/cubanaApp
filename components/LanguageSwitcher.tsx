"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";

type Language = "es" | "en";

interface LanguageSwitcherProps {
  onChange: (lang: Language) => void;
}

export default function LanguageSwitcher({ onChange }: LanguageSwitcherProps) {
  const [language, setLanguage] = useState<Language>("es");

  useEffect(() => {
    const storedLang = localStorage.getItem("language") as Language | null;
    if (storedLang && (storedLang === "es" || storedLang === "en")) {
      setLanguage(storedLang);
      onChange(storedLang);
    }
  }, [onChange]);

  const toggleLanguage = () => {
    const newLang = language === "es" ? "en" : "es";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    onChange(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
      aria-label={language === "es" ? "Switch to English" : "Cambiar a Español"}
    >
      <Globe size={18} />
      <span className="ml-1">{language === "es" ? "EN" : "ES"}</span>
    </button>
  );
}