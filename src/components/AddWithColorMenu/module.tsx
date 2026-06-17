"use client";
import {
  getHighlightColor,
  getHighlightColorList,
} from "@/services/hooks/useHighlightColors";
import { useState } from "react";
import { Add } from "../Add/module";
import * as Style from "./style";

export type AddWithColorMenuProps = {
  onClick?: (color?: string) => void;
};

/**
 * AddWithColorMenu description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered AddWithColorMenu component.
 */
export const AddWithColorMenu = ({ onClick }: AddWithColorMenuProps) => {
  const colors = getHighlightColorList();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Style.Container
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => setMenuOpen(false)}
    >
      <Style.MainButton>
        <Add onClick={() => onClick?.()} />
      </Style.MainButton>
      {menuOpen && (
        <Style.MenuContainer>
          {colors.map((color) => (
            <button
              type="button"
              key={color}
              className="color-option"
              style={{
                backgroundColor: getHighlightColor(
                  color as keyof typeof getHighlightColorList
                )?.backgroundColor,
              }}
              onClick={() => onClick?.(color)}
            />
          ))}
        </Style.MenuContainer>
      )}
    </Style.Container>
  );
};
