"use client";
import type { HighlightBackgroundColors } from "@/services/hooks/useHighlightColors";
import styled from "styled-components";
import { resolveColor } from "../editor/SelectionReferenceMarks";

export const Container = styled.div<{
  $color?: keyof HighlightBackgroundColors;
}>`
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-radius: 50%;
  color: ${({ $color }) => resolveColor($color ?? "amber").text};
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  background-color: ${({ $color, theme }) => resolveColor($color ?? "amber").background || theme.palette.brand.silver};
`;
