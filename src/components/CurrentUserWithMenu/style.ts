"use client";
import styled from "styled-components";
import { MembershipStatus } from "../MembershipStatus";

export const Container = styled.div`
  position: relative;
  width: fit-content;
  .current-user {
    cursor: pointer;
  }
  .current-user-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .open {
    pointer-events: none;
  }
`;

export const MenuContainer = styled.div`
  position: absolute;
  top: -20px;
  left: -20px;
  background-color: ${({ theme }) => theme.palette.brand.white};
  width: 100%;
  min-width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding-top: 70px;
  .membership-status {
    position: absolute;
    top: 26px;
    right: 20px;
    svg {
      height: 16px;
    }
  }
  h6 {
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.palette.brand.silver};
    margin-bottom: 8px;
    margin-top: 16px;
  }
  .back-to-dash {
    font-size: 12px;
    color: ${({ theme }) => theme.palette.brand.silver};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  .account-links {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    a {
      font-size: 16px;
      color: ${({ theme }) => theme.palette.brand.silver};
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

`;

export const StoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  span, em {
    display: block;
  }
  span {
    font-size: 14px;
  }
  em {
    font-size: 12px;
  }

  button {
    display: inline-block;
    font-size: 12px;
    color: ${({ theme }) => theme.palette.brand.silver};
    font-weight: 600;
    border: 1px solid ${({ theme }) => theme.palette.brand.silver};
    border-radius: 8px;
    padding: 3px 5px;
    background-color: ${({ theme }) => theme.palette.brand.white};
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
    height: fit-content;
    text-transform: uppercase;
    text-align: center;
    line-height: 1;
    font-weight: 700;

    &:hover {
      background-color: ${({ theme }) => theme.palette.brand.silver};
      color: ${({ theme }) => theme.palette.brand.white};
    }

  }
`;
