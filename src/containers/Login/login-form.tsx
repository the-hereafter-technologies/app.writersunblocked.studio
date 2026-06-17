"use client";
import { Button } from "@/components/Button";
import * as Styled from "./style";

export const LoginForm = () => {
  return (
    <Styled.FormContainer>
      <input
        type="text"
        placeholder="Start typing your username or email address."
        disabled
      />
      <Button label="Login" arrow type="submit" disabled />
    </Styled.FormContainer>
  );
};
