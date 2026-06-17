"use client";
import { motion } from "motion/react";
import styled from "styled-components";
import { ItemMenuButton } from "../ItemMenuButton";

export const Container = styled.div`
  position: relative;
  z-index: 1;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  width: 100%;

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

  &:hover {
    z-index: 5;
  }


  h3 {
    font-size: 16px;
    font-weight: 400;
  }


`;

export const MenuButton = styled(ItemMenuButton)`
  position: absolute;
  bottom: 0;
  right: 0;
`;

export const Stats = styled.div`
  display: flex;
    gap: 1rem;
    font-size: 12px;
    font-weight: 600;
    margin-top: 10px;
    span {
      &:last-child {
        color: ${({ theme }) => theme.palette.brand.silver};
      }
    }
`;

export const DeleteProjectContainer = styled(motion.div)`
  width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.palette.brand.paper};
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
