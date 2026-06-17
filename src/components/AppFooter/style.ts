"use client";
import styled from "styled-components";

export const Container = styled.footer`
  display: flex;
  flex-direction: column;
  padding: 8px;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 11px;
  color: ${({ theme }) => theme.palette.brand.silver};

  background-color: ${({ theme }) => theme.palette.brand.darkPaper};

  @media ${({ theme }) => theme.media?.lg} {
    flex-direction: row;
    text-align: left;
    justify-content: space-between;
    padding: 8px 5vw;
    font-size: 13px;
    max-height: 35px;
    position: sticky;
    bottom: 0;
    z-index: 1;
  }

  > div:nth-child(1) {
    order: 2;
    @media ${({ theme }) => theme.media?.lg} {
      order: 1;
    }
  }

  > div:nth-child(2) {
    order: 1;
    @media ${({ theme }) => theme.media?.lg} {
      order: 2;
    }
  }

`;
