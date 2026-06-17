"use client";
import { AppPage } from "@/components/AppPage";
import Link from "next/link";
import styled from "styled-components";

export const Container = styled(AppPage)`
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  h1 {
    font-size: 36px;
    margin-bottom: 2rem;
    font-weight: 300;
    line-height: 1.2;
    width: 100%;
    max-width: 95vw;
    padding-left: 5vw;
    @media ${({ theme }) => theme.media?.lg} {
      max-width: 55vw;
    }
  }
`;

export const Card = styled.div`
  background-color: ${({ theme }) => theme.palette.brand.white};
  padding: 2rem;
  border-radius: 12px;
  max-width: 95vw;
  width: 100%;
  height: 100%;
  @media ${({ theme }) => theme.media?.lg} {
    max-width: 55vw;
    min-height: 45vh;
  }
`;

export const CardTitle = styled.h2`
  font-size: 13px;
  margin-bottom: 1rem;
  font-weight: 300;
`;

export const ProjectsList = styled.div`
  display: grid;
  gap: 2rem;
  margin-bottom: 50px;
  @media ${({ theme }) => theme.media?.lg} {
    grid-template-columns: 1fr 1fr;
  }

`;

export const ProjectItem = styled(Link)`
  position: relative;
  z-index: 1;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &:before {
    z-index: -1;
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% + 2rem);
    height: calc(100% + 2rem);
    border-radius: 12px;
    visibility: hidden;
    background-color: ${({ theme }) => theme.palette.brand.paper};
  }

  &:hover:before {
    visibility: visible;
  }


  h3 {
    font-size: 16px;
    font-weight: 400;
  }

  > div {
    display: flex;
    gap: 1rem;
    font-size: 14px;
    font-weight: 600;
    span {
      &:last-child {
        color: ${({ theme }) => theme.palette.brand.silver};
      }
    }
  }

`;
