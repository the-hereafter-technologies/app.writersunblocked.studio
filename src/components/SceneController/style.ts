"use client";
import styled from "styled-components";

export const Container = styled.div`

  ul, ul li {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    align-items: center;
    width: 100%;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  li {
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const SceneButtonContainer = styled.div<{ active?: boolean }>`
  display: flex;
  width: 100%;
  cursor: pointer;
  padding-left: 15px;

  > div {
    font-size: 11px;
    white-space: nowrap;
    overflow: hidden;
    position: relative;
    border-radius: 3px;

    &:hover {
      z-index: 5;
      overflow: visible;
    }
    > span {
      display: inline-block;
      width: 100%;
      background-color: ${({ theme }) => theme.palette.brand.paper};
      border: 1px solid ${({ theme }) => theme.palette.brand.darkPaper};
      padding: 3px;
      border-radius: 3px;
      text-overflow: ellipsis;
    }
  }
`;
