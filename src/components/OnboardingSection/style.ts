"use client";
import { motion } from "motion/react";
import styled from "styled-components";

export const Container = styled.div`
  /* width: 100vw; */

  h1, h2 {
    margin: 0;
    padding: 0;
    font-size: 24px;
    font-weight: 400;
    line-height: 1.3;
  }

  h2 {
    color: ${({ theme }) => theme.palette.brand.silver};
  }

  hgroup {
    margin: 0;
    padding: 0;
    max-width: 95vw;
    padding-left: 40px;
  }
`;

export const Card = styled.div`
  background-color: ${({ theme }) => theme.palette.brand.white};
  border-radius: 20px;
  margin-top: 20px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  width: calc(100vw - 10px - 30px);
  height: calc(85vw - 10px - 50px);

  @media ${({ theme }) => theme.media?.lg} {
    width: 829px;
    height: 545px;
  }

`;

export const CardCover = styled(motion.div).attrs({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
})`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.palette.brand.paper};
`;

export const Header = styled(motion.hgroup)`
  min-height: 65px;
`;

export const Title = styled(motion.h1).attrs({
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, delay: 0.6 },
})``;
export const Subtitle = styled(motion.h2).attrs({
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, delay: 0.3 },
})``;

export const BackGroup = styled.div``;

export const Footer = styled.div`
  margin-top: 20px;
  padding-left: 40px;
  height: 65px;
`;

export const FooterActions = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 8px;
  max-width: 300px;
  font-weight: 600;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
