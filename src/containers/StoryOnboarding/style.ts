"use client";
import { OnboardingPage } from "@/components/OnboardingPage";
import styled from "styled-components";

export const Container = styled(OnboardingPage)``;

export const Panel = styled.div`
  width: 140px;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.palette.brand.silver};
  background-color: ${({ theme }) => theme.palette.brand.paper};
  padding: 8px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  span {
    display: block;
    &:first-child {
      font-weight: 600;
    }
  }

  &.active, &:hover {
    background-color: ${({ theme }) => theme.palette.brand.darkPaper};
    color: ${({ theme }) => theme.palette.brand.black};
  }


`;

export const ModeOption = styled.div`
  text-align: left;
  font-size: 13px;
  max-width: 165px;
  span {
    display: block;
    &:nth-child(1) {
      font-weight: 500;
    }
  }
`;
