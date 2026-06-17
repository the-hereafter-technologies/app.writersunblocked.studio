"use client";

import type { StoryMode } from "@/services/api/story";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Heading2,
  Italic,
  List,
  ListOrdered,
  MessageSquarePlus,
  Pilcrow,
} from "lucide-react";
import type { MouseEvent } from "react";
import styled from "styled-components";
import HelmetIcon from "./hero.svg";
import LocationIcon from "./location.svg";

interface FormattingToolbarProps {
  editor: Editor | null;
  storyMode?: StoryMode;
  visible: boolean;
  top: number;
  left: number;
  hasSelection?: boolean;
  readOnly?: boolean;
  onAddChapter: () => void;
  onAddSceneHeading?: () => void;
  onAddCharacterCue?: () => void;
  onAddDialogue?: () => void;
  onAddAction?: () => void;
  onAddCharacterReference: () => void;
  onAddLocationReference: () => void;
  onAddSelectionComment?: () => void;
}

interface ToolbarStyleProps {
  $visible: boolean;
  $top: number;
  $left: number;
}

const Toolbar = styled.div.attrs<ToolbarStyleProps>(
  ({ $visible, $top, $left }) => ({
    style: {
      top: `${$top}px`,
      left: `${$left}px`,
      opacity: $visible ? 1 : 0,
      pointerEvents: $visible ? "auto" : "none",
    },
  })
)<ToolbarStyleProps>`
  position: absolute;
  display: flex;
  transform: translateX(-50%);
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-radius: 12px;
  background: ${({ theme }) => theme.palette.brand.white};
  z-index: 20;
  transition: opacity 150ms ease;
`;

const ActionButton = styled.button<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ $active, theme }) => ($active ? theme.palette.brand.paper : "transparent")};
  color: ${({ $active, theme }) => ($active ? theme.palette.brand.black : theme.palette.brand.silver)};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.palette.brand.darkPaper};
    color: ${({ theme }) => theme.palette.brand.black};
  }
`;

const Divider = styled.span`
  width: 1px;
  height: 18px;
  background: ${({ theme }) => theme.palette.brand.black};
`;

const ChapterButton = styled.button`
  border: none;
  border-radius: 12px;
  padding: 0 10px;
  height: 32px;
  background: ${({ theme }) => theme.palette.brand.paper};
  color: ${({ theme }) => theme.palette.brand.black};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.palette.brand.silver};
    color: ${({ theme }) => theme.palette.brand.silver};
  }
`;

const ReferenceButton = styled.button`
  border: none;
  border-radius: 12px;
  padding: 0 8px;
  height: 32px;
  background: ${({ theme }) => theme.palette.brand.paper};
  color: ${({ theme }) => theme.palette.brand.black};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.palette.brand.silver};
    color: ${({ theme }) => theme.palette.brand.silver};
  }
`;

function run(event: MouseEvent, action: () => void) {
  event.preventDefault();
  action();
}

export default function FormattingToolbar({
  editor,
  storyMode = "novel",
  visible,
  top,
  left,
  hasSelection = false,
  readOnly = false,
  onAddChapter,
  onAddSceneHeading,
  onAddCharacterCue,
  onAddDialogue,
  onAddAction,
  onAddCharacterReference,
  onAddLocationReference,
  onAddSelectionComment,
}: FormattingToolbarProps) {
  if (!editor || readOnly) return null;

  return (
    <Toolbar $visible={visible} $top={top} $left={left}>
      <ActionButton
        type="button"
        $active={editor.isActive("bold")}
        onMouseDown={(event) =>
          run(event, () => editor.chain().focus().toggleBold().run())
        }
        title="Bold"
      >
        <Bold size={16} />
      </ActionButton>
      <ActionButton
        type="button"
        $active={editor.isActive("italic")}
        onMouseDown={(event) =>
          run(event, () => editor.chain().focus().toggleItalic().run())
        }
        title="Italic"
      >
        <Italic size={16} />
      </ActionButton>
      <ActionButton
        type="button"
        $active={editor.isActive("heading", { level: 2 })}
        onMouseDown={(event) =>
          run(event, () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          )
        }
        title="Heading"
      >
        <Heading2 size={16} />
      </ActionButton>
      <ActionButton
        type="button"
        $active={editor.isActive("paragraph")}
        onMouseDown={(event) =>
          run(event, () => editor.chain().focus().setParagraph().run())
        }
        title="Paragraph"
      >
        <Pilcrow size={16} />
      </ActionButton>
      <ActionButton
        type="button"
        $active={editor.isActive("bulletList")}
        onMouseDown={(event) =>
          run(event, () => editor.chain().focus().toggleBulletList().run())
        }
        title="Bullet list"
      >
        <List size={16} />
      </ActionButton>
      <ActionButton
        type="button"
        $active={editor.isActive("orderedList")}
        onMouseDown={(event) =>
          run(event, () => editor.chain().focus().toggleOrderedList().run())
        }
        title="Ordered list"
      >
        <ListOrdered size={16} />
      </ActionButton>
      <Divider />
      {hasSelection && (
        <>
          {onAddSelectionComment && (
            <ReferenceButton
              type="button"
              onMouseDown={(event) => run(event, onAddSelectionComment)}
              title="Create comment from highlighted text"
            >
              <MessageSquarePlus size={12} />
            </ReferenceButton>
          )}
          <ReferenceButton
            type="button"
            onMouseDown={(event) => run(event, onAddCharacterReference)}
            title="Attach highlighted text to a character"
          >
            <HelmetIcon width={12} />
          </ReferenceButton>
          <ReferenceButton
            type="button"
            onMouseDown={(event) => run(event, onAddLocationReference)}
            title="Attach highlighted text to a location"
          >
            <LocationIcon width={12} />
          </ReferenceButton>
          <Divider />
        </>
      )}
      {storyMode === "screenplay" ? (
        <>
          <ChapterButton
            type="button"
            onMouseDown={(event) => run(event, () => onAddSceneHeading?.())}
            title="Insert scene heading"
          >
            Scene
          </ChapterButton>
          <ChapterButton
            type="button"
            onMouseDown={(event) => run(event, () => onAddCharacterCue?.())}
            title="Insert character cue"
          >
            Cue
          </ChapterButton>
          <ChapterButton
            type="button"
            onMouseDown={(event) => run(event, () => onAddDialogue?.())}
            title="Insert dialogue"
          >
            Dialogue
          </ChapterButton>
          <ChapterButton
            type="button"
            onMouseDown={(event) => run(event, () => onAddAction?.())}
            title="Insert action"
          >
            Action
          </ChapterButton>
        </>
      ) : (
        <ChapterButton
          type="button"
          onMouseDown={(event) => run(event, onAddChapter)}
          title="Insert chapter"
        >
          Chapter
        </ChapterButton>
      )}
    </Toolbar>
  );
}
