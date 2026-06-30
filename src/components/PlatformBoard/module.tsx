import {
  PlatformInput,
  PlatformPostItemList,
  PlatformPostList,
  PlatformType,
} from "@writersunblocked/ui/app";
import * as Style from "./style";

export type PlatformBoardProps = {};

/**
 * PlatformBoard description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered PlatformBoard component.
 */
export const PlatformBoard = ({}: PlatformBoardProps) => {
  return (
    <Style.Container>
      <PlatformInput defaultType={PlatformType.INPUT} />
      <PlatformPostList posts={[]} />
      <PlatformPostItemList postItems={[]} />
    </Style.Container>
  );
};
