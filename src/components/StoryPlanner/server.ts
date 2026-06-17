import { createMention } from "@/services/api/createMention";
import { createNote } from "@/services/api/createNote";
import { createScene } from "@/services/api/createScene";
import { generateShortId, type StoryMention } from "@writersunblocked/ui";

export type PlatformData = {
  mentions: StoryMention[];
};

export const onboardFromPlatform = async (
  storyId: string,
  { mentions, scenes, notes }: PlatformData
) => {
  console.log("mentions", mentions);
  const response = await Promise.all([
    ...mentions.map(
      (mention) =>
        mention &&
        createMention(storyId, {
          name: mention.name,
          color: mention.color,
          mentionType: mention.type,
          status: "confirmed",
        })
    ),
    ...scenes.map((scene: { summary: string; order: number }) =>
      createScene(storyId, {
        title: scene.summary,
        shortId: generateShortId(),
        order: scene.order,
      })
    ),
    ...notes.map((note: { text: string }) =>
      createNote(storyId, {
        body: note.text,
        color: "amber",
      })
    ),
  ]);

  return response;
};
