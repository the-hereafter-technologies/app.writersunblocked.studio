"use client";
import { useStory } from "@/containers/StoryPage";
import { useCallback } from "react";
import { AddWithColorMenu } from "../AddWithColorMenu";
import { SceneButton } from "./scene-button";
import * as Style from "./style";

export type SceneControllerProps = Record<string, never>;

/**
 * SceneController description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered SceneController component.
 */
export const SceneController = (_props: SceneControllerProps) => {
  const { scenes, addScene } = useStory();

  const handleAddScene = useCallback(
    (_color?: string) => {
      void addScene();
    },
    [addScene]
  );

  return (
    <Style.Container>
      <ul>
        {scenes.map((scene) => (
          <li key={scene.id}>
            <SceneButton scene={scene} />
          </li>
        ))}
        <li>
          <AddWithColorMenu onClick={handleAddScene} />
        </li>
      </ul>
    </Style.Container>
  );
};
