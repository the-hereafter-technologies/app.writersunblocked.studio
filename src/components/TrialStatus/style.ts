"use client";
import styled from "styled-components";

export const Container = styled.div`
  background-color: ${({ theme }) => theme.palette.brand.paper};
  border-radius: 12px;
  padding: 14px;
  display: flex;
  margin-top: 20px;
  flex-direction: column;
  gap: 8px;

  h6,p {
    font-size: 14px;
    line-height: 1.25;
    color: ${({ theme }) => theme.palette.brand.black};
  }

  h6 {
    font-weight: 600;
  }


  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: ${({ theme }) => theme.palette.brand.darkPaper};
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 10px;

    span {
      display: block;
      height: 100%;
      background-color: ${({ theme }) => theme.palette.brand.silver};
      border-radius: 4px;
    }
  }
`;
