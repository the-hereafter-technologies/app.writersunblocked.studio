'use client';
import { useStory } from "@/containers/StoryPage"
import { TextInput } from "../TextInput"
import * as Style from "./style";
import { FormProvider, useForm } from "react-hook-form"
import { Chip } from "../Chip"
import { audienceType, genreType, projectType } from "@/containers/StoryOnboarding/data"
import { SelectInput } from "../SelectInput"
import { Button } from "../Button"

export interface SettingsBoardProps {}


/**
 * SettingsBoard description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered SettingsBoard component.
 */
export const SettingsBoard = ({}: SettingsBoardProps) => {
  const form = useForm();
  const {story }= useStory();
  return (
    <FormProvider {...form}>
      <Style.Container>
        <Style.FormContainer>
          <TextInput name="title" label="What is the title of your story?" placeholder={story?.title ?? "Untitled"} />
          <SelectInput
            label="What genre is it?"
            options={genreType}
            name="genre"
            render={(item, isActive) => <Chip {...item} active={isActive} />}
          />
          <SelectInput
            label="Who are you primarily writing for?"
            options={audienceType}
            name="audience"
            render={(item, isActive) => <Chip {...item} active={isActive} />}
          />
          <SelectInput<{ label: string; caption?: string; value: string }>
            label="Is this standalone or a series project?"
            name="projectType"
            options={projectType}
            render={(
              item: { label: string; caption?: string; value: string },
              isActive: boolean,
            ) => (
              <Style.Panel className={isActive ? "active" : ""}>
                <span>{item.label}</span>
                <span>{item.caption}</span>
              </Style.Panel>
            )}
          />
          <TextInput
            label="Pen name"
            name="penName"
            placeholder="If you're writing under a pen name, please add it here."
          />
                  <Button label="Save changes" />

        </Style.FormContainer>
      </Style.Container>
    </FormProvider>
  );
};
