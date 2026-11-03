import { Button, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/hooks/useLocale";
import { useTheme } from "@/hooks/useTheme";

export default function App() {
  const { t } = useTranslation();
  const { lang, setLang } = useLocale();
  const { toggleTheme } = useTheme();

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title>{t("app.title")}</Typography.Title>
      <Button
        type="primary"
        onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      >
        {t("common.language")}
      </Button>{" "}
      <Button onClick={toggleTheme}>{t("common.theme")}</Button>
    </div>
  );
}
