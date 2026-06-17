import { nestApiRequest } from "@/lib/nest-api";
import type { MentionType } from "@/services/api/story";
import type { StoryMention } from "@writersunblocked/ui";

export const createMention = async (
  storyId: string,
  newMention: Partial<StoryMention>
) => {
  return await nestApiRequest<{
    id: string;
    name: string;
    mentionType?: MentionType;
    color?: string | null;
  }>({
    path: `/stories/${storyId}/mentions`,
    method: "POST",
    body: {
      name: newMention.name,
      mentionType: newMention.type,
      status: "confirmed",
      color: newMention.color,
    },
  });

  //     const isPerson =
  //       (created.mentionType ?? mentionType) === "person";
  //     const markName = isPerson
  //       ? "characterReference"
  //       : "locationReference";

  //     activeEditor
  //       .chain()
  //       .focus()
  //       .setTextSelection({ from, to })
  //       .setMark(markName, {
  //         id: created.id,
  //         label: created.name,
  //         color: created.color ?? color,
  //         entityType: isPerson ? "person" : "place",
  //       })
  //       .run();
  //   } catch (caughtError) {
  //     console.error("[mention-create] failed", caughtError);
  //   }
  // })();
};
