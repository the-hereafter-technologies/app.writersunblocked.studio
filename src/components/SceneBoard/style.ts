"use client";
import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding-top: 50px;
  padding-left: 50px;
  padding-right: 50px;
  margin: 0 auto;
  align-items: start;
  width: fit-content;
  overflow: hidden;
`;

export const SceneItem = styled.div`
  display: flex;
  width: 100%;
  min-width: 0;
  touch-action: none;

  button {
    width: fit-content;
    height: fit-content;
    background: transparent;
    border: none;
    cursor: grab;
    padding: 4px;

    &:active {
      cursor: grabbing;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }

  > div {
    flex: 1;
    width: 100%;
    min-width: 0;
  }
`;
