// src/hooks/useLocale.js
import { useContext } from "react";
import { LocaleContext } from "@/providers/localeContext";

export const useLocale = () => useContext(LocaleContext);
