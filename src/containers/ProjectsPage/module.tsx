import { Button } from "@/components/Button";
import { getOnboardingSessionId } from "@/lib/getOnboardingSessionId";
import { nestApiRequest } from "@/lib/nest-api";
import { getMe } from "@/services/api/getMe";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProjectsPageFrame } from "./frame";
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

  const data = await nestApiRequest<Story[]>({
    path: "/stories",
    headers: { cookie },
    cache: "no-store",
  });

  if (data.length === 0) {
    redirect(`/onboarding/story/${getOnboardingSessionId()}`);
  }

  const me = await getMe(cookie);

  return (
    <Style.Container>
      <ProjectsPageFrame user={me} stories={data}>
        <Style.FrameItems>
          <Button
            label="Create New Story"
            arrow
            href={`/onboarding/story/${getOnboardingSessionId()}`}
          />
        </Style.FrameItems>
      </ProjectsPageFrame>
    </Style.Container>
  );
};
