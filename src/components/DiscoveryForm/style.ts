"use client";
import styled from "styled-components";

export const Container = styled.div`
  background-color: ${({ theme }) => theme.palette.brand.paper};
  border-radius: 10px;
`;

export const Wrapper = styled.div`
  padding: 20px;
`;

export const Input = styled.div.attrs({
  contentEditable: true,
})`
  min-height: 100px;
  padding: 15px;
  font-size: 14px;
  outline: none;


  &::before {
    content: attr(data-placeholder);
    color: ${({ theme }) => theme.palette.brand.silver};
    pointer-events: none;
    display: none;
  }

  &:empty::before {
    display: block;
  }
`;

export const Toolbar = styled.div`
  padding: 15px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
`;

export const ToggleLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
`;
