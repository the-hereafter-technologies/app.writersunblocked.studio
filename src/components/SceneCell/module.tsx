import { useStory } from "@/containers/StoryPage";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { array, object, string } from "yup";
import { SceneCellCharacters } from "./characters";
import { SceneCellLocations } from "./locations";
import { SceneCellNotes } from "./notes";
import { SceneCellStats } from "./stats";
import * as Style from "./style";

const schema = object({
  notes: array().of(
    object({
      id: string().optional(),
      content: string().required(),
    })
  ),
});

export interface SceneCellProps {
  sceneId: string;
}

/**
 * SceneCell description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered SceneCell component.
 */
export const SceneCell = ({ sceneId }: SceneCellProps) => {
  const { scenes, characters } = useStory();
  const scene = scenes.find((p) => p.id === sceneId);
  const threadCount = scene?.threadCount ?? 0;
  const wordCount = scene?.wordCount ?? 0;

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      notes: scene?.notes ?? [],
    },
  });

  if (!scene) {
    return null;
  }

  return (
    <FormProvider {...form}>
      <Style.Container>
        <SceneCellStats threadCount={threadCount} wordCount={wordCount} />
        <SceneCellCharacters characters={characters} />
        <SceneCellLocations />
        <SceneCellNotes />
      </Style.Container>
    </FormProvider>
  );
};
