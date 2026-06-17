"use client";
import styled from "styled-components";

export const Wrap = styled.form`
  max-width: 520px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  background-color: ${({ theme }) => theme.palette.brand.paper};
  @media (min-width: 520px) {
    border-radius: 16px;
  }

`;

export const Input = styled.input`
  flex: 1;
  min-width: 220px;
  border: none;
  background: ${({ theme }) => theme.palette.brand.paper};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  outline: none;
`;

export const Message = styled.p<{ $success?: boolean }>`
  width: 100%;
  text-align: center;
  margin-top: 8px;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
  color: ${({ $success }) => ($success ? "#166534" : "#b91c1c")};
`;
