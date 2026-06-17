"use client";
import styled from "styled-components";

export const Container = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.palette.brand.paper};

  svg {
    width: 13px;
    height: 13px;
  }


`;
