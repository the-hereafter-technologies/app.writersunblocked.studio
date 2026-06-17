"use client";
import type { PropsWithChildren } from "react";
import { type DefaultTheme, ThemeProvider } from "styled-components";
import { GlobalStyle } from "./global";

export interface ThemeProps extends PropsWithChildren {
  theme: DefaultTheme;
}

export const Theme = ({ theme, children }: ThemeProps) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};
