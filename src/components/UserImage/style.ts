"use client";
import styled from "styled-components";

export const Container = styled.div`
flex: 0 0 auto;
  img,
  span {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    background-color: ${({ theme }) => theme.palette.brand.silver};
    display: block;
    object-fit: cover;
    object-position: center;
  }
`;
