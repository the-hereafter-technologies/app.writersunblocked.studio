"use client";
import { useStory } from "@/containers/StoryPage/provider";
import { type Scene, updateSceneTitle } from "@/services/api/story";
import { useDebounce } from "@/services/hooks/useDebounce";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import * as Style from "./style";

/**
 * SceneButton description
 *
 * @param {Object} props - The properties object.
 * @param {Scene} props.scene - The scene object.
 * @returns {JSX.Element} The rendered SceneButton component.
 */
export const SceneButton = ({ scene }: { scene: Scene }) => {
  const pathname = usePathname();
  const router = useRouter();
  const chapters = scene.chapters;
  const { storyId } = useStory();
  const [sceneTitle, setSceneTitle] = useState<string>(scene.title);
  const debouncedSceneTitle = useDebounce<string>(sceneTitle, 1000);

  useEffect(() => {
    if (debouncedSceneTitle.trim() === scene.title) return;
    const patchTitle = async () => {
      try {
        await updateSceneTitle(storyId, scene.id, debouncedSceneTitle.trim());
      } catch (error) {
        console.error("Failed to update scene title:", error);
      }
    };
    patchTitle();
  }, [debouncedSceneTitle, scene.title, storyId, scene.id]);

  const handleClick = useCallback(() => {
    router.push(`${pathname}#scene-${scene.shortId}`);
  }, [pathname, router, scene.shortId]);

  // const handleTitleChange = useCallback(
  //   async (event: React.FormEvent<HTMLDivElement>) => {
  //     const newTitle = event.currentTarget.textContent || "";
  //     const saniztizedTitle = newTitle.trim();

  //     // add a debounce here if needed
  //     await updateSceneTitle(storyId, scene.id, saniztizedTitle);

  //   },
  //   [scene.id, storyId]
  // );

  return (
    <Style.SceneButtonContainer onClick={handleClick}>
      {chapters?.map((chapter, index) => (
        <div
          key={chapter}
          className={`scene-button--chapter chapter-${index + 1}`}
        >
          <span>chapter {index + 1}</span>
        </div>
      ))}
      <div className={"scene-button--scene"}>
        <span
          contentEditable
          onInput={(e) => setSceneTitle(e.currentTarget.textContent)}
        >
          {scene.title}
        </span>
      </div>
    </Style.SceneButtonContainer>
  );
};
