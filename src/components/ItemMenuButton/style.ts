"use client";
import styled from "styled-components";

export const Container = styled.div`

`;

export const Dots = styled.div`
  display: flex;
  gap: 2px;
  position: relative;

  > .dot  {
    width: 4px;
    height: 4px;
    background-color: ${({ theme }) => theme.palette.brand.silver};
    border-radius: 150px;

  }
`;

export const MenuContainer = styled.div`
  position: absolute;
  z-index: 1;
  top: 100%;
  right: 0;
`;

export const Menu = styled.div`
  width: 100px;
  min-height: 50px;
  background-color: ${({ theme }) => theme.palette.brand.darkPaper};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 8px 0;

  button, a {
    display: block;
    width: 100%;
    padding: 4px 8px;
    background: none;
    border: none;
    color: ${({ theme }) => theme.palette.brand.silver};
    text-align: left;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.palette.brand.paper};
      color: ${({ theme }) => theme.palette.brand.black};
    }

  }

`;
