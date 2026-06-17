import type { SceneNote } from "@/services/api/story";
import { useFormContext } from "react-hook-form";
import * as Styled from "./style";

export const SceneCellNotes = () => {
  const { watch } = useFormContext();
  const notes = watch("notes");

  return (
    <Styled.NotesContainer>
      {notes.map((note: SceneNote) => (
        <div key={note.id}>{note.content}</div>
      ))}
    </Styled.NotesContainer>
  );
};
