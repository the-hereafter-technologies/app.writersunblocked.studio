"use client";
import styled from "styled-components";

export const Container = styled.div`
  width: 100dvw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;

  p {
    font-size: 36px;
  }
  a {
    display: block;
    width: fit-content;
    margin-top: 40px;
  }
  small {
    font-weight: 200;
  }
`;
