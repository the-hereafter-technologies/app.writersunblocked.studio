import { Button } from "@/components/Button";
import { LogoutButton } from "@/components/LogoutButton";
import { ProjectItem } from "@/components/ProjectItem";
import { getOnboardingSessionId } from "@/lib/getOnboardingSessionId";
import { nestApiRequest } from "@/lib/nest-api";
import { getMe } from "@/services/api/getMe";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import * as Style from "./style";

interface Story {
  id: string;
  title: string;
  wordCount: number;
  lastEditedAt: string;
}

/**
 * ProjectsPage description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered ProjectsPage component.
 */
export const ProjectsPage = async () => {
  const cookie = (await headers()).get("cookie");
  if (!cookie || cookie.length === 0) {
    redirect("/login");
  }
  console.log("cookie", cookie);

  const data = await nestApiRequest<Story[]>({
    path: "/stories",
    headers: { cookie },
    cache: "no-store",
  });
  const me = await getMe(cookie);
  const hasName = Boolean(me.name?.trim());
  const hasHandle = Boolean(me.handle?.trim());

  if (!hasName || !hasHandle) {
    redirect(`/onboarding/user/${getOnboardingSessionId()}`);
  }

  const firstName = me.name?.split(" ")[0] ?? "User";

  return (
    <Style.Container>
      <h1>
        Welcome back,
        <br />
        {firstName}
      </h1>
      <Style.Card>
        <Style.CardTitle>Your Projects</Style.CardTitle>
        <Style.ProjectsList>
          {data.map((story) => (
            <ProjectItem
              key={story.id}
              storyId={story.id}
              href={`/story/${story.id}`}
              title={story.title}
              wordCount={story.wordCount}
              lastEdited={story.lastEditedAt}
            />
          ))}
        </Style.ProjectsList>
        <Button
          label="Create New Project"
          arrow
          href={`/onboarding/story/${getOnboardingSessionId()}`}
        />
      </Style.Card>
      <LogoutButton />
    </Style.Container>
  );
};
