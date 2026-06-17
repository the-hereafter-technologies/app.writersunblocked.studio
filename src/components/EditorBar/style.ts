"use client";
import { colord } from "colord";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background-color: ${({ theme }) => colord(theme.palette.brand.white).alpha(0.85).toHex()};
  backdrop-filter: blur(10px);
  border-radius: 12px;
`;

export const BarButton = styled.button<{ $active?: boolean }>`
  cursor: pointer;
  width: 32px;
  height: 32px;
  color: ${({ theme, $active }) => ($active ? theme.palette.brand.black : theme.palette.brand.silver)};
  background-color: ${({ theme, $active }) => ($active ? theme.palette.brand.darkPaper : "transparent")};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    height: 14px;
    width: auto;
    * {
      fill: ${({ theme, $active }) => ($active ? theme.palette.brand.black : theme.palette.brand.silver)};
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.palette.brand.darkPaper};
    color: ${({ theme }) => theme.palette.brand.black};
    svg * {
      fill: ${({ theme }) => theme.palette.brand.black};
    }
  }

`;

export const ModeChangeContainer = styled.div`
  height: 32px;
`;

export const ModeSelectContainer = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 700;
  background-color: ${({ theme }) => theme.palette.brand.paper};
  padding: 0 12px;
  border-radius: 8px;
  color: ${({ theme }) => theme.palette.brand.silver};
  user-select: none;
  .connection-status {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.palette.brand.silver};
  }
  button {
    height: fit-content;
    cursor: pointer;
    line-height: 0;
  }
  .current-mode {
    font-weight: 500;
    color: ${({ theme }) => theme.palette.brand.black};
  }
`;

export const ModeOption = styled.button<{ $active?: boolean }>`

`;

export const ModeListContainer = styled.div`
  visibility: hidden;
  background-color: ${({ theme }) => theme.palette.brand.white};
  padding-left: 12px;
  padding-top: 20px;
  padding-bottom: 20px;
  border-radius: 8px;

  ul, li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
`;

export const Line = styled.div`
  width: 1px;
  height: 16px;
  background-color: ${({ theme }) => theme.palette.brand.darkPaper};
`;
