"use client";
import styled from "styled-components";

export const Container = styled.div`
  padding: 24px;
`;

export const Header = styled.div`
  margin-bottom: 12px;

  h2 {
    font-size: 20px;
  }
`;

export const CardList = styled.div`
  display: grid;
  gap: 10px;
`;

export const Card = styled.div<{ $type: string }>`
  border-left: 4px solid
    ${({ $type }) => {
      if ($type === "character_tension") return "#ec4899";
      if ($type === "world_pressure") return "#8b5cf6";
      if ($type === "location_potential") return "#14b8a6";
      return "#f59e0b";
    }};
  border-radius: 8px;
  padding: 12px;
  background: ${({ theme }) => theme.palette.brand.white};
  border-top: 1px solid ${({ theme }) => theme.palette.brand.darkPaper};
  border-right: 1px solid ${({ theme }) => theme.palette.brand.darkPaper};
  border-bottom: 1px solid ${({ theme }) => theme.palette.brand.darkPaper};

  p {
    margin: 0;
    line-height: 1.4;
  }
`;

export const Empty = styled.p`
  color: ${({ theme }) => theme.palette.brand.silver};
`;
