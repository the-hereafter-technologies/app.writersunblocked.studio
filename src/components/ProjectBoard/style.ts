"use client";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
`;

export const StoryActions = styled.div`
  max-width: 533px;
  width: 100%;
  margin-top: 60px;

  .delete-story {
    color: red;
  }

  ul {
    display: flex;
    gap: 12px;
    width: 100%;
    max-width: 533px;
    list-style: none;
    padding: 0;
    flex-direction: column;
    color: ${({ theme }) => theme.palette.brand.silver};
    font-size: 19px;
    line-height: 24px;
    font-weight: 500;
  }

`;

export const SceneSettings = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 30px;
  > div {
    flex: 1;
  }
`;

export const BookContentContainer = styled.div`
  flex: 1;
  padding-top: 60px;

  h5 {
    margin-bottom: 19px;
    font-size: 19px;
    font-weight: 300;
    color: ${({ theme }) => theme.palette.brand.silver};
    user-select: none;
  }
`;

export const BookContentGuard = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;
