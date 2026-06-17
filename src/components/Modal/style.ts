"use client";
import { colord } from "colord";
import styled from "styled-components";

export const Container = styled.dialog`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  background-color: transparent;
  border: none;
  pointer-events: none;
  * {
    pointer-events: auto;
  }
`;

export const Scrim = styled.button`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => colord(theme.palette.brand.paper).alpha(0.65).toRgbString()};
  z-index: 999;
  backdrop-filter: blur(8px);
`;
