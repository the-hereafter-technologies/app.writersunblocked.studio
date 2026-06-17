"use client";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.palette.brand.paper};
  border-radius: 12px;
  padding: 14px;
  font-size: 14px;

  > span {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.palette.brand.silver};
  }

  > h6 {
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.palette.brand.black};
    margin-top: 4px;
    margin-bottom: 12px;
  }

  p {
    font-size: 14px;
    line-height: 1.25;
  }

  button {
    text-align: left;
    font-size: 12px;
    color: ${({ theme }) => theme.palette.brand.silver};
    font-weight: 600;
    width: fit-content;
  }
`;
