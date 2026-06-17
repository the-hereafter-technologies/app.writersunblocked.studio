"use client";
import styled from "styled-components";

export const Container = styled.div`
  padding: 0 12px;
`;

export const Card = styled.div`
  background-color: ${({ theme }) => theme.palette.brand.paper};
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 21px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const EntityHeader = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 6px;
  font-size: 14px;
  user-select: none;

  svg {
    width: 12px;
    height: 12px;
  }
`;

export const EntityBody = styled.div`
  font-size: 13px;
`;

export const Footer = styled.div``;
