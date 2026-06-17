"use client";
import { type DefaultTheme } from "styled-components";
import * as brand from "./colors";
import { monaSans } from "./fonts";

export const Main: DefaultTheme = {
  id: "main",
  palette: {
    text: brand.black,
    background: brand.darkPaper,
    accent: brand.paper,
    brand,
  },
  typography: {
    body: {
      fontFamily: monaSans.style.fontFamily,
      color: brand.black,
      fontSize: 16,
    },
  },
  breakpoints: {
    sm: 576,
    md: 768,
    lg: 1024,
  },
  gutters: {
    sm: 20,
    md: 40,
    lg: 80,
  },
  media: {
    sm: `screen and (min-width: 576px)`,
    md: `screen and (min-width: 768px)`,
    lg: `screen and (min-width: 1024px)`,
  },
};
