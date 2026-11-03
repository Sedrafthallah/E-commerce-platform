import ThemeProvider from "./ThemeProvider";
import LocaleProvider from "./LocaleProvider";

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <LocaleProvider>{children}</LocaleProvider>
    </ThemeProvider>
  );
}
