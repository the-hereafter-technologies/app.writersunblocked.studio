"use client";
import styled from "styled-components";

export const Container = styled.div`
  flex: 1;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 15px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  &::-webkit-scrollbar {
    display: none; /* WebKit */
  }
  padding-bottom: 40px;
`;
