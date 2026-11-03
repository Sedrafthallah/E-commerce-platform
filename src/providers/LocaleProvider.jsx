import { useEffect, useMemo, useState } from "react";
import { ConfigProvider } from "antd";
import i18n from "@/i18n";
import { languages, getInitialLang } from "@/i18n/languages";
import { LANG_KEY } from "@/constants/storage";
import { LocaleContext } from "./localeContext";

export default function LocaleProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);
  const { dir, antdLocale } = languages[lang];

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem(LANG_KEY, lang);
  }, [lang, dir]);

  const value = useMemo(
    () => ({
      lang,
      dir,
      isRtl: dir === "rtl",
      languages,
      setLang: (next) => Object.hasOwn(languages, next) && setLangState(next),
    }),
    [lang, dir],
  );

  return (
    <LocaleContext.Provider value={value}>
      <ConfigProvider direction={dir} locale={antdLocale}>
        {children}
      </ConfigProvider>
    </LocaleContext.Provider>
  );
}
