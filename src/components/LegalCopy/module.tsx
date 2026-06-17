import * as Style from "./style";

export interface LegalCopyProps {}


/**
 * LegalCopy description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered LegalCopy component.
 */
export const LegalCopy = ({}: LegalCopyProps) => {
  return (
    <Style.Container>
      © 2026 The Hereafter Technologies · writersunblocked.studio · Privacy · Terms
    </Style.Container>
  );
};
