"use client";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  gap: 5px;
  > div {
    flex: 1;

    &:nth-child(2) {
        background-color: ${({ theme }) => theme.palette.brand.paper};
    }
  }
`;
