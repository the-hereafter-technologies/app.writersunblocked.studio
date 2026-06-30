"use client";
import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    flex: 0 0 50%;

    .header {
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-weight: 400;
      font-size: 24px;
      margin-bottom: 1rem;

      span {
        color: ${({ theme }) => theme.palette.brand.silver};
        font-weight: 300;
      }
    }

    @media ${({ theme }) => theme.media?.lg} {
      flex-direction: row;
    }

    > div {
      height: 50dvh;
      overflow: hidden;
      @media ${({ theme }) => theme.media?.lg} {
        height: 100vh;
        width: 100%;
      }

      &:nth-child(1) {
        padding: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

    }

    .login-with > span {
      display: block;
      margin-bottom: 0.5rem;
      font-style: italic;
      color: ${({ theme }) => theme.palette.brand.silver};
    }

    .login-with > button {
      background-color: ${({ theme }) => theme.palette.brand.paper};
      border-radius: 8px;
      display: flex;
      gap: 10px;
      padding: 15px;
      color: ${({ theme }) => theme.palette.brand.black};
      text-align: center;
      width: 300px;
    }

    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
      object-position: center;
    }

    .login-error {
      max-width: 487px;
      margin-bottom: 1rem;
      padding: 0.85rem 1rem;
      border-radius: 10px;
      background-color: ${({ theme }) => theme.palette.brand.paper};
      color: ${({ theme }) => theme.palette.brand.black};
      font-size: 14px;
      line-height: 1.5;
    }

    .disabled-disclaimed {
      font-size: 11px;
      color: ${({ theme }) => theme.palette.brand.black};
      font-weight: bold;
      max-width: 487px;
      margin-bottom: 1rem;
      margin-top: 2rem;
    }

`;

export const FormContainer = styled.div`

  margin-bottom: 50px;
  margin-top: 2rem;

`;

export const LoginWithGoogleButton = styled.button`
  svg {
    width: 20px;
    height: 20px;
  }
`;
