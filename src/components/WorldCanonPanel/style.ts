"use client";
import styled from "styled-components";

export const Container = styled.div`
  padding: 24px;
`;

export const Header = styled.div`
  margin-bottom: 16px;

  h2 {
    font-size: 20px;
  }

  p {
    font-size: 13px;
    color: ${({ theme }) => theme.palette.brand.silver};
  }
`;

export const FieldList = styled.div`
  display: grid;
  gap: 12px;
`;

export const Field = styled.label`
  display: grid;
  gap: 6px;

  span {
    font-size: 12px;
    text-transform: capitalize;
  }

  input {
    border: 1px solid ${({ theme }) => theme.palette.brand.silver};
    border-radius: 8px;
    padding: 10px;
  }
`;

export const AddRuleRow = styled.div`
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px;

  input {
    border: 1px solid ${({ theme }) => theme.palette.brand.silver};
    border-radius: 8px;
    padding: 10px;
  }

  button {
    border: 1px solid ${({ theme }) => theme.palette.brand.black};
    border-radius: 8px;
    padding: 10px 12px;
  }
`;

export const Hint = styled.p`
  margin-top: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.palette.brand.silver};
`;
