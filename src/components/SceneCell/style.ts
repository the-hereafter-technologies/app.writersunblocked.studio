"use client";
import styled from "styled-components";

export const Container = styled.div``;

export const NotesContainer = styled.div``;

export const SectionLabel = styled.div``;

export const SceneCellStatsContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 15px;
  width: 100%;
  > div {
    flex: 1;
  }
`;

export const SceneCellStatsCard = styled.div`
  background-color: ${({ theme }) => theme.palette.brand.paper};
  padding: 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  font-weight: 300;
  font-size: 14px;
  span:nth-child(1) {
    font-weight: 500;
  }

`;
