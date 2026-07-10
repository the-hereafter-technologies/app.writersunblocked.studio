"use client";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  gap: 5px;
  height: 100%;
`;

export const Column = styled.div`
  flex: 1;
  height: 100%;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    display: none;
  }

  &::-webkit-scrollbar-track {
    display: none;
  }

  &:nth-child(1) > div {
    height: 100%;
  }

  &:nth-child(2) {
    background-color: ${({ theme }) => theme.palette.brand.paper};
  }
`;

export const Message = styled.p<{ $variant?: "error" }>`
  margin: 12px 0 0;
  font-size: 14px;
  color: ${({ theme, $variant }) =>
    $variant === "error"
      ? theme.palette.brand.blush
      : theme.palette.brand.silver};
`;
