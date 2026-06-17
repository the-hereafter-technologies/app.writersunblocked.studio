import { Button } from "@/components/Button";
import { headers } from "next/headers";
import * as Style from "./style";

export type NotFoundProps = {};

/**
 * NotFound description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered NotFound component.
 */
export const NotFound = async () => {
  let route = "/";

  try {
    const cookie = (await headers()).get("cookie");
    if (!cookie) throw new Error("No cookie found");
    route = "/";
  } catch (error: unknown) {
    route = "/";
  }

  return (
    <Style.Container>
      <p>
        <small>404</small>
        <br />
        We looked everywhere.
        <br />
        <strong>This is a plot hole.</strong> <br />
        Get your <em>story</em> unblocked.
        <Button href={route} label="Back to home" arrow />
      </p>
    </Style.Container>
  );
};
