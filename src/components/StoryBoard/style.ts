"use client";
import { colord } from "colord";
import { motion } from "motion/react";
import styled, { css } from "styled-components";

export const Container = styled.form``;

export const Scrim = styled(motion.div).attrs({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: 0.3,
  },
})`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  backdrop-filter: blur(5px);
`;

export const PanelContainer = styled(motion.div).attrs({
  initial: { y: "100vh" },
  animate: { y: 0 },
  exit: { y: "100vh" },
  transition: {
    duration: 0.3,
  },
})`
  background-color: ${({ theme }) => theme.palette.brand.white};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 95vh;
  z-index: 30;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  flex-direction: column;
`;

export const ScrollWrapper = styled.div`
  flex: 1;
  overflow: scroll;
  display: flex;
  // Hide scrollbar for WebKit browsers
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const PanelHeader = styled.div`
  position: sticky;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
  gap: 8px;
  height: 100%;
  margin-right: 2px;
  > div {
    height: 100%;
  }
`;

export const PanelContent = styled.div`
  display: flex;
  flex: 1;
  // Hide scrollbar for WebKit browsers
  &::-webkit-scrollbar {
    display: none;
  }

`;

export const PanelBoardWrapper = styled.div`
  flex: 1;
`;

export const PanelCellContainer = styled.div`
  background-color: ${({ theme }) => theme.palette.brand.darkPaper};
  min-height: 100%;
  border-radius: 16px;
  width: 400px;
  overflow: scroll;
  // Hide scrollbar for WebKit browsers
  &::-webkit-scrollbar {
    display: none;
  }

`;

export const PanelCellWrapper = styled.div`
  position: sticky;
  top: 0;
`;

export const PanelEditorView = styled.div``;

export const BoardPanelContainer = styled.div`
 display: flex;
 flex-direction: column;
 height: calc(100% - 60px);
 position: sticky;
`;
export const BoardPanelHeader = styled.div`
  padding: 20px;
  h2 {
    font-size: 12px;
  }
`;

export const BoardPanelCardList = styled.div`
  flex: 1;
  padding-right: 20px;
  gap: 12px;
  display: flex;
  flex-direction: column;
`;

export const BoardPanelCard = styled.div``;

export const BoardPanelToolbar = styled.div`
  padding: 15px;
  background-color: ${({ theme }) => theme.palette.brand.white};
`;

export const AuthorHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 40px;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 150%;
    background: ${({ theme }) => css`linear-gradient(to bottom, ${theme.palette.brand.paper}, ${colord(theme.palette.brand.paper).alpha(0).toRgbString()});`};
    content: '';
    pointer-events: none;
    z-index: -1;
  }
`;
