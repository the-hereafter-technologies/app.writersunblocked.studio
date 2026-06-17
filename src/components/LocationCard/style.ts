"use client";
import styled from "styled-components";

export const Container = styled.div`
  padding: 0 12px;
`;

export const Card = styled.div`
  background-color: ${({ theme }) => theme.palette.brand.paper};
  border-radius: 12px;
  padding: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    text-align: left;
    font-size: 12px;
    color: ${({ theme }) => theme.palette.brand.silver};
    font-weight: 600;
    width: fit-content;
    border: 1px solid ${({ theme }) => theme.palette.brand.silver};
    border-radius: 6px;
    padding: 4px 8px;
    background: transparent;
    cursor: pointer;
  }

`;
