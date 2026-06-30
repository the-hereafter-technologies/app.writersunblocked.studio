"use client";

import {
  type AppUser,
  type Story,
  UserSidebar,
} from "@writersunblocked/ui/app";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { logout } from "./server";
import * as Styled from "./style";

export interface ProjectsPageFrameProps {
  children: React.ReactNode;
  user: AppUser;
  stories: Story[];
}

export const ProjectsPageFrame = ({
  children,
  user,
  stories,
}: ProjectsPageFrameProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleClick = useCallback(
    async (testId: string, storyId?: string) => {
      switch (testId) {
        case "logout":
          setLoading(true);
          await logout();
          router.push("/");
          setLoading(false);
          break;
        case "open-story":
          router.push(`/story/${storyId}`);
          break;
        case "open-storyboard":
          router.push(`/story/${storyId}#storyboard`);
          break;
        case "privacy":
          window.open("https://writersunblocked.studio/privacy", "_blank");
          break;
        case "terms":
          window.open("https://writersunblocked.studio/terms", "_blank");
          break;
        default:
          console.error(`Unknown testId: ${testId}`);
          break;
      }
    },
    [router]
  );

  return (
    <Styled.FrameContainer>
      <UserSidebar user={user} stories={stories} onClick={handleClick} />
      <Styled.FrameContent>{children}</Styled.FrameContent>
    </Styled.FrameContainer>
  );
};
