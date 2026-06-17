"use client";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MembershipStatus } from "../MembershipStatus";
import { TrialStatus } from "../TrialStatus";
import * as Style from "./style";

/**
 * CurrentUserMenu description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered CurrentUserMenu component.
 */
export const CurrentUserMenu = ({
  onMouseLeave,
}: {
  onMouseLeave: () => void;
}) => {
  const { stories } = useCurrentUser();
  const router = useRouter();

  // get only 3
  const recentStories = stories.slice(0, 3);

  return (
    <Style.MenuContainer onMouseLeave={onMouseLeave}>
      <MembershipStatus />
      <h6>My Stories</h6>
      {recentStories.map((story) => (
        <Style.StoryItem key={story.id}>
          <div>
            <span>{story.title}</span>
            <em>Started {moment(story.createdAt).fromNow()}</em>
          </div>
          <button
            onClick={() => router.push(`/story/${story.id}`)}
            type="button"
          >
            Open
          </button>
        </Style.StoryItem>
      ))}
      <div>
        <Link className="back-to-dash" href="/">
          Return to my stories
        </Link>
      </div>
      <TrialStatus />
      <div className="account-links">
        <Link href="/account/me">Manage my account</Link>
        <Link href="/account/billing">Manage Billing</Link>
      </div>
    </Style.MenuContainer>
  );
};
