"use client";
import { type MouseEvent, useState } from "react";
import BoldIcon from "./icons/bold.svg";
import ChapterIcon from "./icons/chapter.svg";
import CommentIcon from "./icons/comment.svg";
import EntityVersionIcon from "./icons/entity-version.svg";
import HeaderOneIcon from "./icons/header-one.svg";
import ItalicIcon from "./icons/italic.svg";
import JustifyCenterIcon from "./icons/justify-center.svg";
import JustifyLeftIcon from "./icons/justify-left.svg";
import JustifyRightIcon from "./icons/justify-right.svg";
import JustifyFullIcon from "./icons/justify.svg";
import MentionIcon from "./icons/mention.svg";
import NoteIcon from "./icons/note.svg";
import ParagraphIcon from "./icons/paragraph.svg";
import StrikethroughIcon from "./icons/strikethrough.svg";
import TagIcon from "./icons/tag.svg";
import UnderlineButton from "./icons/underline.svg";

import { ModeChange } from "./mode";
import * as Style from "./style";
import { type ButtonAction, EditorMode } from "./types";

export interface EditorBarProps {
  onActionClick: (action: ButtonAction) => void;
}

/**
 * EditorBar description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered EditorBar component.
 */
export const EditorBar = ({ onActionClick }: EditorBarProps) => {
  const [mode, setMode] = useState<EditorMode>(EditorMode.Writing);

  const preserveEditorFocus = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleActionMouseDown =
    (action: ButtonAction) => (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      console.log("[shared-editor-bar] button mousedown", { action });
      onActionClick(action);
    };

  return (
    <Style.Container>
      <ModeChange
        mode={mode}
        onChange={(newMode: EditorMode) => setMode(newMode)}
      />
      <Style.BarButton
        type="button"
        onMouseDown={handleActionMouseDown("bold")}
      >
        <BoldIcon />
      </Style.BarButton>
      <Style.BarButton
        type="button"
        onMouseDown={handleActionMouseDown("italic")}
      >
        <ItalicIcon />
      </Style.BarButton>
      <Style.BarButton
        type="button"
        onMouseDown={handleActionMouseDown("strikethrough")}
      >
        <StrikethroughIcon />
      </Style.BarButton>
      <Style.BarButton
        type="button"
        onMouseDown={handleActionMouseDown("underline")}
      >
        <UnderlineButton />
      </Style.BarButton>
      <Style.Line />
      <Style.BarButton
        type="button"
        onMouseDown={handleActionMouseDown("justifyLeft")}
      >
        <JustifyLeftIcon />
      </Style.BarButton>
      <Style.BarButton
        type="button"
        onMouseDown={handleActionMouseDown("justifyCenter")}
      >
        <JustifyCenterIcon />
      </Style.BarButton>
      <Style.BarButton
        type="button"
        onMouseDown={handleActionMouseDown("justifyRight")}
      >
        <JustifyRightIcon />
      </Style.BarButton>
      <Style.BarButton
        type="button"
        onMouseDown={handleActionMouseDown("justifyFull")}
      >
        <JustifyFullIcon />
      </Style.BarButton>
      <Style.Line />
      <Style.BarButton
        type="button"
        onMouseDown={handleActionMouseDown("chapter")}
      >
        <ChapterIcon />
      </Style.BarButton>
      <Style.BarButton
        type="button"
        onMouseDown={handleActionMouseDown("header")}
      >
        <HeaderOneIcon />
      </Style.BarButton>
      <Style.BarButton
        type="button"
        onMouseDown={handleActionMouseDown("paragraph")}
      >
        <ParagraphIcon />
      </Style.BarButton>
      <Style.BarButton
        type="button"
        onMouseDown={handleActionMouseDown("entity-version")}
      >
        <EntityVersionIcon />
      </Style.BarButton>
      <Style.Line />
      <Style.BarButton
        type="button"
        onMouseDown={handleActionMouseDown("mention")}
      >
        <MentionIcon />
      </Style.BarButton>
      <Style.BarButton type="button" onMouseDown={handleActionMouseDown("tag")}>
        <TagIcon />
      </Style.BarButton>
      <Style.BarButton
        type="button"
        onMouseDown={handleActionMouseDown("note")}
      >
        <NoteIcon />
      </Style.BarButton>
      <Style.BarButton
        type="button"
        onMouseDown={handleActionMouseDown("comment")}
      >
        <CommentIcon />
      </Style.BarButton>
    </Style.Container>
  );
};
