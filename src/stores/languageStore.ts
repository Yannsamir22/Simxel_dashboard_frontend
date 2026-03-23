import { create } from "zustand";

type Lang = "en" | "fr";
interface LanguageStore {
  language: Lang;
  setLanguage: (lang: Lang) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: (localStorage.getItem("lang") as Lang) ?? "en",
  setLanguage: (lang) => {
    localStorage.setItem("lang", lang);
    set({ language: lang });
  },
  toggleLanguage: () =>
    set((state) => {
      const next: Lang = state.language === "en" ? "fr" : "en";
      localStorage.setItem("lang", next);
      return {
        language: next,
      };
    }),
}));
