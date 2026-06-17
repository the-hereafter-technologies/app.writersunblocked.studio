"use client";
import { useState } from "react";
import { CurrentUser } from "../CurrentUser/module";
import { MembershipStatus } from "../MembershipStatus";
import { CurrentUserMenu } from "./menu";
import * as Style from "./style";

/**
 * CurrentUserWithMenu description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered CurrentUserWithMenu component.
 */
export const CurrentUserWithMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };

  return (
    <Style.Container onMouseEnter={handleMouseEnter}>
      <div className={`current-user-header ${isMenuOpen ? "open" : ""}`}>
        <CurrentUser />
      </div>
      {isMenuOpen && <CurrentUserMenu onMouseLeave={handleMouseLeave} />}
    </Style.Container>
  );
};
