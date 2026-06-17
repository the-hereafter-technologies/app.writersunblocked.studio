"use client";
import { type RuleSet, createGlobalStyle, css } from "styled-components";
import { normalize } from "styled-normalize";

export const GlobalStyle = createGlobalStyle<{ styles?: RuleSet }>`
  ${normalize}

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  ${({ theme }) => css`
    html {
      font-size: ${theme.typography.body.fontSize}px;
      height: 100%;
    }

    body {
      font-family: ${theme.typography.body.fontFamily};
      color: ${theme.palette.text};
      background-color: ${theme.palette.background};
      font-size: ${theme.typography.body.fontSize}px;
      line-height: 1.25;
      min-height: 100%;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      overflow-x: hidden;
    }

  `}

  a, a:link, a:visited {
    text-decoration: none;
    color: inherit;
  }

  p {
    margin-bottom: 1rem;
  }

  button {
    cursor: pointer;
    background: none;
    border: none;
    line-height: inherit;
    font-size: inherit;
    color: inherit;
    margin: 0;
    display: inline-block;
    padding: 0;
    width: fit-content;
  }

  input {
    border: none;
    outline: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }
`;
