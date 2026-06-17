"use client";
import Link from "next/link";
import styled from "styled-components";

export const Container = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  font-size: 14px;
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.palette.brand.black};
  border-radius: 8px;
  line-height: 1;
  white-space: nowrap;

  &:disabled {
    color: ${({ theme }) => theme.palette.brand.silver};
    border-color: ${({ theme }) => theme.palette.brand.silver};
    cursor: not-allowed;
  }

`;

export const LinkContainer = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  font-size: 14px;
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.palette.brand.black};
  border-radius: 8px;
  line-height: 1;
  white-space: nowrap;
`;
