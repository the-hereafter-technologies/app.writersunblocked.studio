"use client";
import { colord } from "colord";
import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 32px;
`;

export const MainButton = styled.div`
  position: relative;
  z-index: 1;
`;

export const MenuContainer = styled.div`
  min-width: 100%;
  min-height: 100%;
  padding: 10px;
  margin-top: -10px;
  margin-left: -10px;
  background-color: ${({ theme }) => theme.palette.brand.darkPaper};
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  border-radius: 100px;
  padding-left: 50px;

  button {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin: 5px;
    border: none;
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 12px ${({ theme }) => colord(theme.palette.brand.black).alpha(0.1).toHex()};
    }
  }

`;
