"use client";
import { StoryBarWithMenu } from "@writersunblocked/ui/app";
import { motion } from "motion/react";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  height: 100%;
  flex: 1;


  [data-ref-type="character"] {
    background-color: ${({ theme }) => theme.palette.brand.paper} !important;
  }
`;

export const SceneContainer = styled.div`
  flex:1;
  background-color: ${({ theme }) => theme.palette.brand.paper};
`;

export const AuthorColumn = styled.div`
  flex: 0 0 auto;
  background-color: ${({ theme }) => theme.palette.brand.white};
  height: 100dvh;
  position: sticky;
  top: 0;
  width: 60px;
  display: flex;
  flex-direction: column;
`;

export const OpenContainer = styled.div`
  padding-top: 20px;
`;

export const StoryBoardColumn = styled.div`
  background-color: ${({ theme }) => theme.palette.brand.darkPaper};
  width: 340px;
  position: sticky;
  top: 0;
  height: 100vh;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  overflow: hidden;
  z-index: 1;
  flex: 0 0 auto;
`;

export const DiscoverColumn = styled.div`
  position: sticky;
  top: 0;
  height: calc(100vh - 35px);
  background-color: #E1DFDA;
  width: 320px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  overflow: hidden;
  z-index: 1;
  margin-left: -20px;
  display: flex;
  flex-direction: column;

`;

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
  z-index: 1;
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
  z-index: 12;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  overflow: scroll;
  padding: 20px;

`;

export const ScrollWrapper = styled.div``;

export const PanelHeader = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.palette.brand.paper};
  font-size: 12px;
  display: flex;
  border-radius: 200px;
  font-weight: 700;
  overflow: hidden;
  button {
    padding: 8px 9px;
    border-radius: 3px;
    &:hover {
      background-color: ${({ theme }) => theme.palette.brand.darkPaper};
    }

    &[data-active="true"] {
      background-color: ${({ theme }) => theme.palette.brand.darkPaper};
      font-weight: 700;
    }

  }
`;

export const PanelContent = styled.div`
  overflow: scroll;
`;
export const PanelEditorView = styled.div``;

export const BoardPanelContainer = styled.div`
 display: flex;
 flex-direction: column;
 height: 100%;
`;
export const BoardPanelHeader = styled.div`
  padding: 20px;
  h2 {
    font-size: 12px;
  }
`;

export const BoardPanelCardList = styled.div`
  flex: 1;
  padding: 0 20px;
  gap: 12px;
  display: flex;
  flex-direction: column;
`;

export const BoardPanelCard = styled.div`
  margin: 0 auto;
  width: 100%;
`;

export const BoardPanelToolbar = styled.div`
  padding: 15px;
  background-color: ${({ theme }) => theme.palette.brand.white};
`;

export const AuthorHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
`;

export const MainSideBar = styled(StoryBarWithMenu)`
  position: sticky;
  top: 0;
  z-index: 20;
  height: fit-content;
`;
