"use client";
import styled from "styled-components";

export const Container = styled.div`
  width: 400px;
  background-color: ${({ theme }) => theme.palette.brand.saffron};
  height: 545px;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .offer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .switch {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .save {
      font-size: 8px;
      background-color: ${({ theme }) => theme.palette.brand.gold};
      padding: 2px 6px;
      border-radius: 20px;
      font-weight: 900;
      text-transform: uppercase;

    }

    label {
      width: 50px;
      height: 25px;
      display: flex;
      align-items: center;
      cursor: pointer;
      background-color: ${({ theme }) => theme.palette.brand.darkPaper};
      border-radius: 12.5px;
      input {
        display: none;
      }
      span {
        width: 25px;
        height: 25px;
        background-color: ${({ theme }) => theme.palette.brand.paper};
        border-radius: 12.5px;
        transition: all 0.3s ease;
      }

      input:checked + span {
        background-color: ${({ theme }) => theme.palette.brand.gold};
        transform: translateX(25px);
      }

    }
  }

  .buttons {
    display: flex;
    gap: 4px;
    align-items: flex-end;
    flex: 1;
    > div {
      min-height: 70px;
      &:nth-child(1) {
        button,a {
          background-color: ${({ theme }) => theme.palette.brand.gold};
          font-weight: 500;
        }
      }
    }

    button, a {
      padding: 6px 10px;
    }
    small {
      display: block;
      font-size: 9px;
      line-height: 12px;
      margin-top: 10px;
    }
  }

  > div  {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    ul, li {
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 14px;
    }

    &:nth-child(1) {
      background-color: ${({ theme }) => theme.palette.brand.paper};
      border-radius: 20px;
      color: ${({ theme }) => theme.palette.brand.silver};
    }

    &:nth-child(2) {
      flex: 1;
    }

  }

  h4, h5 {
    margin-bottom: 12px;
  }

  h5 {
    font-size: 16px;
  }
  h4 {
    font-size: 19px;
  }

  h6 {
    text-transform: uppercase;
    letter-spacing: 3px;
  }
`;

export const IsSubscriber = styled(Container)`
  background: ${({ theme }) => theme.palette.brand.saffron};
  padding: 2rem;
`;
