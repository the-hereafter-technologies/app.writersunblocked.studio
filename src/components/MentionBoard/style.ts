"use client";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  > div {
    flex: 1;
  }
`;

export const EmptyState = styled.div`
  padding: 20px;
  color: ${({ theme }) => theme.palette.brand.darkPaper};
  font-size: 14px;
`;

export const MentionList = styled.div`
 display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;
export const StoryMentions = styled.div`
  padding-top: 100px;
`;
export const StoryMention = styled.div`
  background-color: ${({ theme }) => theme.palette.brand.paper};
  > div {
    height: 95dvh;
    padding-top: 65px;
    position: sticky;
    top: 0;
  }
`;
