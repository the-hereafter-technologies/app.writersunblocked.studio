"use client";
import { useStory } from "@/containers/StoryPage";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { object, string } from "yup";
import { TextInput } from "../TextInput";
import * as Style from "./style";

const schema = object({
  name: string()
    .required("Name is required")
    .max(100, "Name must be at most 100 characters"),
});

export interface CharacterCellProps {
  characterId?: string | null;
}

/**
 * CharacterCell description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered CharacterCell component.
 */
export const CharacterCell = ({ characterId }: CharacterCellProps) => {
  const { characters } = useStory();
  const character = characters.find((c) => c.id === characterId);
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: character?.name || "",
    },
  });

  if (!character) {
    return null;
  }

  return (
    <FormProvider {...form}>
      <Style.Container>
        <h1>{character?.name}</h1>
        <TextInput placeholder="Name your character" name="name" label="Name" />
      </Style.Container>
    </FormProvider>
  );
};
