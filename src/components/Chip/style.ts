"use client";
import styled from "styled-components";

export const Container = styled.button<{ $active?: boolean }>`
  font-size: 14px;
  padding: 6px 8px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${({ theme, $active }) =>
		$active ? theme.palette.brand.darkPaper : theme.palette.brand.paper};
  color: ${({ theme, $active }) =>
		$active ? theme.palette.brand.black : theme.palette.brand.silver};
`;
