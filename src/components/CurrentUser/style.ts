"use client";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;

  span {
    display: block;
    font-size: 12px;
    line-height: 16px;

    &:nth-child(1) {
      font-weight: 700;
    }
  }

`;
