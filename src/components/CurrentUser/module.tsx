"use client";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import { UserImage } from "../UserImage";
import * as Style from "./style";
import { useStory } from "@/containers/StoryPage";

/**
 * CurrentUser description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered CurrentUser component.
 */
export const CurrentUser = () => {
  const { user } = useCurrentUser();
  const { story } = useStory();
  const author = story?.penName ?? user?.name ?? "Anonymous";
  const handle = user?.handle ?? "unknown";

  return (
    <Style.Container className="current-user">
      <UserImage image={user?.image} />
      <div>
        <span>by {author}</span>
        <span>@{handle}</span>
      </div>
    </Style.Container>
  );
};
