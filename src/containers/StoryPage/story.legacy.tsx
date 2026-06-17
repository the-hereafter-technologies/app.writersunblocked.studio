"use client";

import StoryEditor from "@/components/editor/StoryEditor";
import type { ButtonAction } from "@/components/EditorBar/types";
import { useModal } from "@/components/Modal/hooks";
import type { SceneSavePayload } from "@/services/api/story";
import {
  getHighlightColorList,
  type HighlightBackgroundColors,
} from "@/services/hooks/useHighlightColors";
import type { Editor } from "@tiptap/react";
import { AddMention, EditorBar } from "@writersunblocked/ui";
import { useCallback, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { useObserver } from "./observer";
import { useStory } from "./provider";
import { createMention } from "./utils";

const SCENE_BOUNDARY_NODE = "sceneBoundary";

const Shell = styled.section`
  min-height: calc(100dvh - 35px);
  flex: 1;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }

  [data-ref-type="location"],
  [data-ref-type="character"] {
    background-color: ${({ theme }) => theme.palette.brand.paper} !important;
    text-decoration: none;
    border-color: transparent !important;
  }
`;

const EditorColumn = styled.section`
  background: ${({ theme }) => theme.palette.brand.paper};
  min-height: 100%;
`;

const SaveMeta = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.palette.brand.black};
`;

const SharedEditorBarSlot = styled.div`
  position: sticky;
  top: 30px;
  z-index: 15;
  display: flex;
  justify-content: center;
  padding: 8px 0;
`;

const SceneEditorSection = styled.section`
  border-top: none;
`;

const NoVisibleScenes = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding: 48px 32px;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  color: ${({ theme }) => theme.palette.brand.black};
`;

const ErrorText = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
  color: #b91c1c;
`;

type StoryDocNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  content?: StoryDocNode[];
};

type StoryDocJson = {
  type?: string;
  content?: StoryDocNode[];
};

type StoryBlock = {
  id: string;
  sceneId?: string | null;
  content: string;
  contentJSON: unknown;
  order: number;
  status: string;
};

const hashJson = (value: unknown) => {
  return JSON.stringify(value ?? null);
};

const buildSceneDocument = (sceneBlocks: StoryBlock[]) => {
  const sorted = [...sceneBlocks].sort(
    (left, right) => left.order - right.order
  );
  const nodes: StoryDocNode[] = [];
  const text: string[] = [];

  for (const block of sorted) {
    const maybeDoc = block.contentJSON as StoryDocJson;
    if (maybeDoc?.type === "doc" && Array.isArray(maybeDoc.content)) {
      nodes.push(...maybeDoc.content);
    }

    if (typeof block.content === "string" && block.content.trim().length > 0) {
      text.push(block.content.trim());
    }
  }

  return {
    content: text.join("\n\n"),
    contentJSON: { type: "doc", content: nodes },
  };
};

const flattenTextFromNode = (node: StoryDocNode): string => {
  if (typeof node.text === "string") {
    return node.text;
  }

  if (!Array.isArray(node.content) || node.content.length === 0) {
    if (node.type === "paragraph") {
      return "\n";
    }

    return "";
  }

  const nested = node.content.map(flattenTextFromNode).join("");

  if (node.type === "paragraph" || node.type === "chapter") {
    return `${nested}\n`;
  }

  return nested;
};

const toSceneSavePayload = (nodes: StoryDocNode[]): SceneSavePayload => {
  const contentJSON: StoryDocJson = {
    type: "doc",
    content: nodes,
  };

  const content = nodes
    .map(flattenTextFromNode)
    .join("")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const wordCount = content.length
    ? content.split(/\s+/).filter(Boolean).length
    : 0;

  return {
    content,
    contentJSON,
    wordCount,
  };
};

const splitUnifiedDocByScene = (
  contentJSON: unknown,
  sceneIdsInOrder: string[]
): Map<string, SceneSavePayload> => {
  const doc = contentJSON as StoryDocJson;
  const rootNodes = Array.isArray(doc?.content) ? doc.content : [];
  const sceneNodeMap = new Map<string, StoryDocNode[]>();

  for (const sceneId of sceneIdsInOrder) {
    sceneNodeMap.set(sceneId, []);
  }

  let currentSceneId = sceneIdsInOrder[0] ?? null;

  for (const node of rootNodes) {
    if (node.type === SCENE_BOUNDARY_NODE) {
      const sceneIdAttr = node.attrs?.sceneId;
      if (typeof sceneIdAttr === "string" && sceneNodeMap.has(sceneIdAttr)) {
        currentSceneId = sceneIdAttr;
      }
      continue;
    }

    if (!currentSceneId) {
      continue;
    }

    const bucket = sceneNodeMap.get(currentSceneId);
    if (!bucket) {
      continue;
    }

    bucket.push(node);
  }

  const payloadMap = new Map<string, SceneSavePayload>();
  for (const [sceneId, nodes] of sceneNodeMap.entries()) {
    payloadMap.set(sceneId, toSceneSavePayload(nodes));
  }

  return payloadMap;
};

type MentionType = "person" | "place" | "thing";

const promptMentionType = (defaultType: MentionType = "person") => {
  const raw = window
    .prompt("Mention type (person, place, thing)", defaultType)
    ?.trim()
    .toLowerCase();

  if (!raw) {
    return null;
  }

  if (raw === "person" || raw === "place" || raw === "thing") {
    return raw;
  }

  window.alert("Mention type must be one of: person, place, thing");
  return null;
};

const promptMentionColor = (
  defaultColor: keyof HighlightBackgroundColors = "amber"
) => {
  const colors = getHighlightColorList() as Array<
    keyof HighlightBackgroundColors
  >;
  const raw = window
    .prompt(`Mention color (${colors.join(", ")})`, defaultColor)
    ?.trim()
    .toLowerCase();

  if (!raw) {
    return null;
  }

  if (colors.includes(raw as keyof HighlightBackgroundColors)) {
    return raw as keyof HighlightBackgroundColors;
  }

  window.alert(`Mention color must be one of: ${colors.join(", ")}`);
  return null;
};

export const StoryContent = () => {
  const { registerEditor, registerSceneSection } = useObserver();
  const activeEditorRef = useRef<Editor | null>(null);
  const savedSelectionRef = useRef<{ from: number; to: number } | null>(null);
  const sceneHashesRef = useRef<Map<string, string>>(new Map());
  const storyIdRef = useRef<string | null>(null);
  const {
    story,
    scenes,
    queueMessage,
    isLoading,
    error,
    isReadOnly,
    saveScene,
    saveStatusByKey,
    lastSavedAtByKey,
  } = useStory();

  const { openModal, closeModal } = useModal();

  const visibleScenes = useMemo(() => {
    return [...scenes]
      .filter((scene) => scene.visible)
      .sort((left, right) => left.order - right.order);
  }, [scenes]);

  const sceneDocuments = useMemo(() => {
    const blocks: StoryBlock[] = [];
    const byScene = new Map<string, StoryBlock[]>();

    for (const block of blocks) {
      if (!block.sceneId) {
        continue;
      }

      const current = byScene.get(block.sceneId) ?? [];
      current.push(block);
      byScene.set(block.sceneId, current);
    }

    const docs = new Map<
      string,
      { content: string; contentJSON: StoryDocJson }
    >();
    for (const scene of visibleScenes) {
      docs.set(scene.id, buildSceneDocument(byScene.get(scene.id) ?? []));
    }

    return docs;
  }, [visibleScenes]);

  const unifiedDocument = useMemo(() => {
    const nodes: StoryDocNode[] = [];
    const contentText: string[] = [];

    for (const scene of visibleScenes) {
      nodes.push({
        type: SCENE_BOUNDARY_NODE,
        attrs: {
          sceneId: scene.id,
          title: scene.title,
          order: scene.order,
        },
      });

      const sceneDoc = sceneDocuments.get(scene.id);
      const sceneNodes = sceneDoc?.contentJSON?.content;
      if (Array.isArray(sceneNodes) && sceneNodes.length > 0) {
        nodes.push(...sceneNodes);
      } else {
        nodes.push({ type: "paragraph" });
      }

      if (sceneDoc?.content) {
        contentText.push(sceneDoc.content);
      }
    }

    return {
      content: contentText.join("\n\n"),
      contentJSON: {
        type: "doc",
        content: nodes,
      } satisfies StoryDocJson,
    };
  }, [sceneDocuments, visibleScenes]);

  useEffect(() => {
    if (!story) {
      return;
    }

    if (storyIdRef.current !== story.id) {
      sceneHashesRef.current = new Map();
      storyIdRef.current = story.id;
    }

    for (const scene of visibleScenes) {
      if (sceneHashesRef.current.has(scene.id)) {
        continue;
      }

      const sceneDoc = sceneDocuments.get(scene.id);
      sceneHashesRef.current.set(scene.id, hashJson(sceneDoc?.contentJSON));
    }
  }, [sceneDocuments, story, visibleScenes]);

  const latestSavedAt = useMemo(() => {
    const visibleSceneSavedAt = visibleScenes
      .map((scene) => lastSavedAtByKey[`scene:${scene.id}`])
      .filter((value): value is number => typeof value === "number");

    if (visibleSceneSavedAt.length === 0) {
      return null;
    }

    return Math.max(...visibleSceneSavedAt);
  }, [lastSavedAtByKey, visibleScenes]);

  const storySaveStatus = useMemo(() => {
    const statuses = visibleScenes
      .map((scene) => saveStatusByKey[`scene:${scene.id}`])
      .filter(Boolean);

    if (statuses.some((status) => status.state === "saving")) {
      return statuses.find((status) => status.state === "saving") ?? null;
    }

    if (statuses.some((status) => status.state === "error")) {
      return statuses.find((status) => status.state === "error") ?? null;
    }

    if (statuses.some((status) => status.state === "saved")) {
      return statuses.find((status) => status.state === "saved") ?? null;
    }

    return null;
  }, [saveStatusByKey, visibleScenes]);

  const editorMountKey = useMemo(() => {
    return visibleScenes
      .map((scene) => `${scene.id}:${scene.order}:${scene.title}`)
      .join("|");
  }, [visibleScenes]);

  const persistUnifiedDraft = useCallback(
    async (payload: { contentJSON: unknown }) => {
      const sceneIds = visibleScenes.map((scene) => scene.id);
      const payloadByScene = splitUnifiedDocByScene(
        payload.contentJSON,
        sceneIds
      );

      for (const sceneId of sceneIds) {
        const nextPayload = payloadByScene.get(sceneId);
        if (!nextPayload) {
          continue;
        }

        const nextHash = hashJson(nextPayload.contentJSON);
        const previousHash = sceneHashesRef.current.get(sceneId);

        if (nextHash === previousHash) {
          continue;
        }

        await saveScene(sceneId, nextPayload);
        sceneHashesRef.current.set(sceneId, nextHash);
      }
    },
    [saveScene, visibleScenes]
  );

  const handleSharedEditorBarAction = useCallback(
    (action: ButtonAction) => {
      if (isReadOnly) {
        return;
      }

      const activeEditor = activeEditorRef.current;
      if (!activeEditor) {
        return;
      }

      const liveSelection = activeEditor.state.selection;
      const { from, to } =
        liveSelection.empty && savedSelectionRef.current
          ? savedSelectionRef.current
          : liveSelection;

      switch (action) {
        case "bold":
          activeEditor.chain().focus().toggleBold().run();
          return;
        case "italic":
          activeEditor.chain().focus().toggleItalic().run();
          return;
        case "strikethrough":
          activeEditor.chain().focus().toggleStrike().run();
          return;
        case "header":
          activeEditor.chain().focus().toggleHeading({ level: 2 }).run();
          return;
        case "paragraph":
          activeEditor.chain().focus().setParagraph().run();
          return;
        case "mention": {
          if (!story?.id) {
            return;
          }

          const selectedText = activeEditor.state.doc.textBetween(
            from,
            to,
            " "
          );

          console.log("Selected text for mention:", selectedText);

          // if there is no selection do nothing
          if (from === to) {
            return;
          }

          // get the original text of the selection to use as a seed for the mention name

          openModal(
            <AddMention
              defaultValues={{
                name: selectedText,
              }}
              onValidSubmit={async (newMention) => {
                try {
                  const mention = await createMention(story.id, newMention);
                  const markName = mention.mentionType ?? "thing";

                  activeEditor
                    .chain()
                    .focus()
                    .setTextSelection({ from, to })
                    .setMark(markName, {
                      id: mention.id,
                      label: mention.name,
                      color: mention.color ?? "amber",
                      entityType: mention.mentionType,
                    })
                    .run();

                  // clear the saved selection since we've now applied the mention to the current selection
                  savedSelectionRef.current = null;

                  closeModal();
                } catch (error) {}
              }}
            />,
            { scrim: true }
          );

          // void (async () => {
          //   try {
          //     const created = await nestApiRequest<{
          //       id: string;
          //       name: string;
          //       mentionType?: MentionType;
          //       color?: string | null;
          //     }>({
          //       path: `/stories/${story.id}/mentions`,
          //       method: "POST",
          //       body: {
          //         name: seed,
          //         mentionType,
          //         status: "confirmed",
          //         color,
          //       },
          //     });

          //     const isPerson =
          //       (created.mentionType ?? mentionType) === "person";
          //     const markName = isPerson
          //       ? "characterReference"
          //       : "locationReference";

          //     activeEditor
          //       .chain()
          //       .focus()
          //       .setTextSelection({ from, to })
          //       .setMark(markName, {
          //         id: created.id,
          //         label: created.name,
          //         color: created.color ?? color,
          //         entityType: isPerson ? "person" : "place",
          //       })
          //       .run();
          //   } catch (caughtError) {
          //     console.error("[mention-create] failed", caughtError);
          //   }
          // })();

          return;
        }
        default:
          return;
      }
    },
    [isReadOnly, story?.id, openModal, closeModal]
  );

  if (isLoading) {
    return <p style={{ padding: 20 }}>Loading story...</p>;
  }

  if (!story) {
    return <p style={{ padding: 20 }}>Story not found.</p>;
  }

  const primaryScene = visibleScenes[0] ?? null;

  return (
    <Shell>
      <EditorColumn>
        {error ? <ErrorText>{error.message}</ErrorText> : null}

        {storySaveStatus ? (
          <SaveMeta>
            Save status: {storySaveStatus.state}
            {storySaveStatus.error ? ` (${storySaveStatus.error})` : ""}
          </SaveMeta>
        ) : null}

        {typeof latestSavedAt === "number" ? (
          <SaveMeta>
            Last saved: {new Date(latestSavedAt).toLocaleTimeString()}
          </SaveMeta>
        ) : null}

        {queueMessage ? <SaveMeta>{queueMessage}</SaveMeta> : null}

        <SharedEditorBarSlot>
          <EditorBar onActionClick={handleSharedEditorBarAction} />
        </SharedEditorBarSlot>

        {visibleScenes.length === 0 ? (
          <NoVisibleScenes>
            No visible scenes. Unhide or add a scene to continue writing.
          </NoVisibleScenes>
        ) : (
          <SceneEditorSection
            data-scene-id={primaryScene?.id ?? "story"}
            data-scene-order={primaryScene?.order ?? 0}
            id={primaryScene ? `scene-${primaryScene.id}` : "scene-story"}
            ref={(node) => {
              if (!primaryScene) {
                return;
              }

              registerSceneSection(primaryScene.id, node);
            }}
          >
            <StoryEditor
              key={editorMountKey}
              storyId={story.id}
              storyMode={story.mode ?? "novel"}
              initialContent={unifiedDocument.content}
              initialContentJSON={unifiedDocument.contentJSON}
              onSaveDraft={persistUnifiedDraft}
              onEditorReady={(editor: Editor | null) => {
                activeEditorRef.current = editor;

                if (!primaryScene) {
                  return;
                }

                registerEditor(primaryScene.id, editor);
              }}
              onEditorFocus={(editor: Editor | null) => {
                activeEditorRef.current = editor;
              }}
              onEditorPointerDown={() => {
                if (activeEditorRef.current) {
                  return;
                }
              }}
              showEditorBar={false}
              readOnly={isReadOnly}
              onSelectionChange={(from, to) => {
                savedSelectionRef.current = { from, to };
              }}
              onCreateSelectionComment={undefined}
              syncCharacterMentions={false}
            />
          </SceneEditorSection>
        )}
      </EditorColumn>
    </Shell>
  );
};
