import { useEffect, useMemo, useState } from "react";
import { ConfigProvider } from "antd";
import { lightTheme, darkTheme } from "@/theme";
import { THEME_KEY } from "@/constants/storage";
import { appConfig } from "@/config/app";
import { ThemeContext } from "./themeContext";

const query = "(prefers-color-scheme: dark)";
const getSystemMode = () =>
  window.matchMedia(query).matches ? "dark" : "light";

export default function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(
    () => localStorage.getItem(THEME_KEY) || appConfig.defaultTheme,
  );
  const [systemMode, setSystemMode] = useState(getSystemMode);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setSystemMode(e.matches ? "dark" : "light");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const mode = preference === "system" ? systemMode : preference;

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      preference,
      setTheme: (next) => {
        localStorage.setItem(THEME_KEY, next);
        setPreference(next);
      },
      toggleTheme: () => {
        const next = mode === "dark" ? "light" : "dark";
        localStorage.setItem(THEME_KEY, next);
        setPreference(next);
      },
    }),
    [mode, preference],
  );

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={mode === "dark" ? darkTheme : lightTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
