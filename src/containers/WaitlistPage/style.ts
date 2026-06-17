"use client";
import { WaitlistForm } from "@/components/WaitlistForm";
import Image from "next/image";
import styled from "styled-components";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;

  header {
    padding: 20px;
    padding-top: 10vh;
    color: ${({ theme }) => theme.palette.brand.turquoise};
    font-size: 1.25rem;
    @media ${({ theme }) => theme.media?.lg} {
      font-size: 1.5rem;
    }
  }

  h1, h2 {
    font-size: 1.5rem;
    margin: 1rem 0;
    font-weight: 600;
    line-height: 1.2;
    padding: 0 20px;
    color: ${({ theme }) => theme.palette.brand.silver};
    @media ${({ theme }) => theme.media?.lg} {
      font-size: 3.5rem;
    }
  }

  h2 {
    color: ${({ theme }) => theme.palette.brand.black};
    font-size: 1.25rem;
    font-weight: 100;
    @media ${({ theme }) => theme.media?.lg} {
      font-size: 1.75rem;
    }
  }

  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    font-weight: 300;
  }

  ul {
    display: flex;
    flex-direction: column;
    margin-top: 50px;
    @media ${({ theme }) => theme.media?.lg} {
      flex-direction: row;
      list-style: none;
    }

    li {
      flex: 1;
      padding: 20px;
      strong {
        font-weight: 500;
      }
    }
  }

  footer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 20px;
    color: ${({ theme }) => theme.palette.brand.silver};
    text-align: center;
    font-size: 0.875rem;
    a {
      color: ${({ theme }) => theme.palette.brand.turquoise};
      margin: 0 5px;
    }
    @media ${({ theme }) => theme.media?.lg} {
      justify-content: space-between;
      flex-direction: row;
      text-align: left;
    }
    .login{
      margin-top: 10px;
      @media ${({ theme }) => theme.media?.lg} {
        margin-top: 0;
      }
    }

  }
`;

export const SignUpForWaitlist = styled(WaitlistForm)`
  padding: 10px 20px;
  margin-top: 40px;
`;

export const DemoImageItem = styled(Image)`
  width: 100%;
  height: auto;

  @media ${({ theme }) => theme.media?.lg} {
    height: 55vh;
    position: absolute;
    top: 0;
    right: 0;
    z-index: -1;
    width: auto;
  }

`;
