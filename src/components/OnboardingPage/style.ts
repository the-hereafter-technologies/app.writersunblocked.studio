"use client";
import styled from "styled-components";

export const Container = styled.form`
  flex: 1;
  padding-top: 20px;
  padding-bottom: 20px;
  max-width: 100dvw;
  overflow: hidden;
  display: flex;

`;

export const Rail = styled.div`
  display: flex;
  gap: 15px;
  padding-left: 10px;
  padding-right: 10px;
  align-items: center;
  flex: 1;
  transition: transform 0.3s ease-in-out;

  @media ${({ theme }) => theme.media?.lg} {
    padding-left: 100px;
    padding-right: 100px;
    gap: 45px;
  }


`;
