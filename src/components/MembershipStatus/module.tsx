import * as Style from "./style";
import BirdIcon from "./bird.svg";
import { ComponentProps, useMemo } from "react";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import { useTheme } from "styled-components";

export interface MembershipStatusProps
  extends ComponentProps<typeof Style.Container> {}

/**
 * MembershipStatus description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered MembershipStatus component.
 */
export const MembershipStatus = ({ ...props }: MembershipStatusProps) => {
  const { user } = useCurrentUser();
  const theme = useTheme();
  const status = user?.subscriptionStatus;

  const color = useMemo(() => {
    switch (status) {
      case "active":
        return theme.palette.brand.gold;
      case "trialing":
        return theme.palette.brand.darkPaper;
      case "canceled":
        return "#F44336"; // Red for canceled members
      default:
        return theme.palette.brand.white;
    }
  }, [status, theme.palette]);

  return (
    <Style.Container className="membership-status" {...props}>
      <BirdIcon color={color} />
    </Style.Container>
  );
};
