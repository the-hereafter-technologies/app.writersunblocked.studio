"use client";
import styled from "styled-components";

export const Container = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 8px 16px;    
  border: 1px solid ${({ theme }) => theme.palette.brand.black};
  border-radius: 8px;
  line-height: 1;
  white-space: nowrap;
`;
