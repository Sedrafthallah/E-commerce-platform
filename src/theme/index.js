import { theme } from "antd";
import { colors } from "./colors";

const token = {
  colorPrimary: colors.primary,
  colorPrimaryHover: colors.primaryLight,
  colorPrimaryActive: colors.primaryDark,
  borderRadius: 12,
};

export const lightTheme = { algorithm: theme.defaultAlgorithm, token };
export const darkTheme = { algorithm: theme.darkAlgorithm, token };