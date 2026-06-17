"use client";
import { Fragment, useMemo, useState } from "react";
import * as Style from "./style";

export type MenuItem = {
  label: string;
  onClick: () => void;
};

export type ItemMenuButtonProps = {
  data: MenuItem[];
  render: (item: MenuItem) => React.ReactNode;
};

/**
 * ItemMenuButton description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered ItemMenuButton component.
 */
export const ItemMenuButton = ({
  data = [],
  render,
  ...props
}: ItemMenuButtonProps) => {
  const [isOpen, setOpen] = useState(false);

  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);

  const isReady = useMemo(
    () => typeof render === "function" && Array.isArray(data),
    [render, data]
  );

  if (!isReady) return null;

  return (
    <Style.Container
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <Style.Dots>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </Style.Dots>
      {isOpen && (
        <Style.MenuContainer>
          <Style.Menu>
            {data.map((v) => (
              <Fragment key={v.label}>{render(v)}</Fragment>
            ))}
          </Style.Menu>
        </Style.MenuContainer>
      )}
    </Style.Container>
  );
};
