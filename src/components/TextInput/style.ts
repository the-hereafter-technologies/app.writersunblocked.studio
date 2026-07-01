"use client";
import { spellcheckGuardAttrs } from "@/lib/spellcheck-guard";
import styled, { css } from "styled-components";
import { Label } from "../Label";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 500px;
`;

export const TextLabel = styled(Label)``;

export const TextCaption = styled.span`
  font-size: 11px;
`;

export const TextField = styled.div.attrs({
	contentEditable: true,
	...spellcheckGuardAttrs,
})<{ $empty?: boolean; $placeholder?: string }>`
  padding: 0;
  border: none;
  outline: none;
  border-bottom: 1px solid ${({ theme }) => theme.palette.brand.silver};
  font-size: 19px;
  padding-bottom: 10px;

  &::before {
    content: attr(data-placeholder);
    color: ${({ theme }) => theme.palette.brand.silver};
    display: none;
  }

  ${({ $empty }) =>
		$empty &&
		css`
    &::before {
      display: block;
    }
  `}



`;
