"use client";

import { nestApiRequest } from "@/lib/nest-api";
import { useMemo, useState } from "react";
import styled from "styled-components";

type SceneNote = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type Scene = {
  id: string;
  title: string;
  order: number;
  visible: boolean;
  wordCount: number;
  threadCount: number;
  mentionCount: number;
  chapters: string[];
  notes: SceneNote[];
};

type ScenesPanelProps = {
  storyId: string;
  scenes: Scene[];
  readOnly: boolean;
  onChanged: () => Promise<void> | void;
};

const Wrap = styled.section`
  border-bottom: 1px solid ${({ theme }) => theme.palette.brand.black};
  background: ${({ theme }) => theme.palette.brand.paper};
  padding: 10px 12px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Heading = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  color: ${({ theme }) => theme.palette.brand.black};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  border: 1px solid ${({ theme }) => theme.palette.brand.black};
  background: ${({ theme }) => theme.palette.brand.paper};
  color: ${({ theme }) => theme.palette.brand.black};
  border-radius: 12px;
  padding: 5px 10px;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const SceneList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SceneCard = styled.article`
  border: 1px solid ${({ theme }) => theme.palette.brand.black};
  border-radius: 12px;
  padding: 8px;
  background: ${({ theme }) => theme.palette.brand.paper};

  & + & {
    border-top: 2px solid #000;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const SceneTitle = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.palette.brand.black};
`;

const SceneTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VisibilityPill = styled.span<{ $visible: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 2px 8px;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 11px;
  line-height: 1;
  border: 1px solid #000;
  color: #000;
  background: ${({ $visible }) => ($visible ? "#d1fae5" : "#e5e7eb")};
`;

const Meta = styled.p`
  margin: 6px 0 0;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.palette.brand.black};
`;

const ChapterList = styled.p`
  margin: 6px 0 0;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.palette.brand.black};
`;

const NotesWrap = styled.div`
  margin-top: 8px;
  border-top: 1px dashed ${({ theme }) => theme.palette.brand.black};
  padding-top: 8px;
`;

const NoteRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
`;

const NoteText = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.palette.brand.black};
`;

const NoteInput = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.palette.brand.black};
  border-radius: 12px;
  padding: 6px 8px;
  background: ${({ theme }) => theme.palette.brand.paper};
  color: ${({ theme }) => theme.palette.brand.black};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
`;

const Muted = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.palette.brand.black};
`;

export default function ScenesPanel({
  storyId,
  scenes,
  readOnly,
  onChanged,
}: ScenesPanelProps) {
  const [busySceneId, setBusySceneId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draftBySceneId, setDraftBySceneId] = useState<Record<string, string>>(
    {}
  );

  const orderedScenes = useMemo(
    () => [...scenes].sort((left, right) => left.order - right.order),
    [scenes]
  );

  const createScene = async () => {
    if (readOnly || creating) return;

    try {
      setCreating(true);
      await nestApiRequest({
        path: `/stories/${storyId}/scenes`,
        method: "POST",
        body: {},
      });
      await onChanged();
    } finally {
      setCreating(false);
    }
  };

  const toggleVisibility = async (scene: Scene) => {
    if (readOnly) return;

    try {
      setBusySceneId(scene.id);
      await nestApiRequest({
        path: `/stories/${storyId}/scenes/${scene.id}`,
        method: "PATCH",
        body: { visible: !scene.visible },
      });
      await onChanged();
    } finally {
      setBusySceneId(null);
    }
  };

  const addNote = async (sceneId: string) => {
    if (readOnly) return;

    const content = draftBySceneId[sceneId]?.trim();
    if (!content) return;

    try {
      setBusySceneId(sceneId);
      await nestApiRequest({
        path: `/scenes/${sceneId}/notes`,
        method: "POST",
        body: { content },
      });
      setDraftBySceneId((prev) => ({ ...prev, [sceneId]: "" }));
      await onChanged();
    } finally {
      setBusySceneId(null);
    }
  };

  const deleteNote = async (sceneId: string, noteId: string) => {
    if (readOnly) return;

    try {
      setBusySceneId(sceneId);
      await nestApiRequest({
        path: `/scenes/${sceneId}/notes/${noteId}`,
        method: "DELETE",
      });
      await onChanged();
    } finally {
      setBusySceneId(null);
    }
  };

  const renderScene = (scene: Scene) => (
    <SceneCard key={scene.id}>
      <Row>
        <SceneTitleGroup>
          <SceneTitle>{scene.title}</SceneTitle>
          <VisibilityPill $visible={scene.visible}>
            {scene.visible ? "Visible" : "Hidden"}
          </VisibilityPill>
        </SceneTitleGroup>
        <HeaderActions>
          <ActionButton
            type="button"
            onClick={() => toggleVisibility(scene)}
            disabled={readOnly || busySceneId === scene.id}
          >
            {scene.visible ? "Hide" : "Show"}
          </ActionButton>
        </HeaderActions>
      </Row>

      <Meta>
        {scene.wordCount} words • {scene.threadCount} threads •{" "}
        {scene.mentionCount} mentions
      </Meta>

      <NotesWrap>
        {scene.notes.length === 0 ? (
          <Muted>No notes yet.</Muted>
        ) : (
          scene.notes.map((note) => (
            <NoteRow key={note.id}>
              <NoteText>{note.content}</NoteText>
              <ActionButton
                type="button"
                onClick={() => deleteNote(scene.id, note.id)}
                disabled={readOnly || busySceneId === scene.id}
              >
                Delete
              </ActionButton>
            </NoteRow>
          ))
        )}

        <Row>
          <NoteInput
            value={draftBySceneId[scene.id] ?? ""}
            onChange={(event) =>
              setDraftBySceneId((prev) => ({
                ...prev,
                [scene.id]: event.target.value,
              }))
            }
            placeholder="Add note..."
            disabled={readOnly || busySceneId === scene.id}
          />
          <ActionButton
            type="button"
            onClick={() => addNote(scene.id)}
            disabled={readOnly || busySceneId === scene.id}
          >
            Add
          </ActionButton>
        </Row>
      </NotesWrap>
    </SceneCard>
  );

  return (
    <Wrap>
      <Header>
        <Heading>Scenes</Heading>
        <HeaderActions>
          <ActionButton
            type="button"
            onClick={createScene}
            disabled={readOnly || creating}
          >
            {creating ? "Adding..." : "Add Scene"}
          </ActionButton>
        </HeaderActions>
      </Header>

      {orderedScenes.length === 0 ? (
        <Muted>No scenes yet.</Muted>
      ) : (
        <SceneList>{orderedScenes.map(renderScene)}</SceneList>
      )}
    </Wrap>
  );
}
