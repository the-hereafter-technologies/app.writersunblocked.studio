"use client";
import styled from "styled-components";
import { CharacterAvatar } from "../CharacterAvatar";

export const Container = styled.div`
  display: flex;
  > div:not(:first-child) {
    margin-left: -16px;
  }
`;

export const Avatar = styled(CharacterAvatar)``;
