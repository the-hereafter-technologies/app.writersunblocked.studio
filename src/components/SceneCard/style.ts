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
  gap: 20px;
  overflow: hidden;

  button {
    text-align: left;
    font-size: 12px;
    color: ${({ theme }) => theme.palette.brand.silver};
    font-weight: 600;
    width: fit-content;
    border: 1px solid ${({ theme }) => theme.palette.brand.silver};
    border-radius: 6px;
    padding: 4px 8px;
    background: transparent;
    cursor: pointer;
  }
  .scene-card {


    &--content {
      display: flex;
      gap: 24px;
      width: 100%;
    }

    &--stats {
      font-size: 14px;
      white-space: nowrap;
    }

    &--characters {
      display: flex;
    }

    &--chapter {
      display: flex;
      white-space: nowrap;
      gap: 4px;
      font-size: 12px;
      overflow: hidden;
      color: ${({ theme }) => theme.palette.brand.silver};
      span {
        display: flex;
        width: 16px;
        height: 16px;
        background-color: ${({ theme }) => theme.palette.brand.darkPaper};
        border-radius: 4px;
        text-align: center;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 900;
      }
      > div {
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        font-weight: 900;
      }
    }

    &--details {
      flex: 1;
      font-size: 12px;
    }
  }

`;
