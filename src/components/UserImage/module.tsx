import Image from "next/image";
import * as Style from "./style";

export interface UserImageProps {
  image?: string | null;
}

/**
 * UserImage description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered UserImage component.
 */
export const UserImage = ({ image }: UserImageProps) => {
  return (
    <Style.Container>
      {image ? (
        <Image src={image} alt="User" width={32} height={32} />
      ) : (
        <span />
      )}
    </Style.Container>
  );
};
