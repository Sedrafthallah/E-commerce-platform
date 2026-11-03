import arEG from "antd/locale/ar_EG";
import enUS from "antd/locale/en_US";
import { LANG_KEY } from "@/constants/storage";
import { appConfig } from "@/config/app";

export const languages = {
  ar: { label: "العربية", dir: "rtl", antdLocale: arEG },
  en: { label: "English", dir: "ltr", antdLocale: enUS },
};

export function getInitialLang() {
  const saved = localStorage.getItem(LANG_KEY);
  return Object.hasOwn(languages, saved) ? saved : appConfig.defaultLang;
}
