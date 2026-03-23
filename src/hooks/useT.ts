import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../stores/languageStore";

export function useT() {
  const { t, i18n } = useTranslation();
  const lang = useLanguageStore((state) => state.language);

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return { t };
}
