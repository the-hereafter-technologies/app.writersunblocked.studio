"use client";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  user-select: none;
  span {
    white-space: nowrap;
  }
  svg {
    width: 12px;
    height: 12px;
    margin-top: 2px;
  }
`;
