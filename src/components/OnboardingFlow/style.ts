"use client";
import styled from "styled-components";

export const Container = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 24px;
`;

export const Header = styled.div`
  margin-bottom: 24px;

  h1 {
    font-size: 30px;
    margin-bottom: 8px;
  }

  p {
    color: ${({ theme }) => theme.palette.brand.silver};
  }
`;

export const Step = styled.div`
  background: ${({ theme }) => theme.palette.brand.white};
  border-radius: 14px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.palette.brand.darkPaper};
`;

export const Prompt = styled.h2`
  font-size: 18px;
  margin-bottom: 14px;
`;

export const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const ChipButton = styled.button<{ $active: boolean }>`
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.palette.brand.black : theme.palette.brand.silver};
  background: ${({ theme, $active }) =>
    $active ? theme.palette.brand.darkPaper : theme.palette.brand.white};
  font-size: 13px;
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 130px;
  border: 1px solid ${({ theme }) => theme.palette.brand.silver};
  border-radius: 10px;
  padding: 12px;
  resize: vertical;
`;

export const Footer = styled.div`
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Progress = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.palette.brand.silver};
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

export const GhostButton = styled.button`
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.palette.brand.silver};
  border-radius: 8px;
`;

export const PrimaryButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.brand.black};
  color: ${({ theme }) => theme.palette.brand.white};
`;

export const ErrorText = styled.p`
  margin-top: 10px;
  color: #c0392b;
`;
