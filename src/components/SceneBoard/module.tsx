"use client";
import { useStory } from "@/containers/StoryPage";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useState } from "react";
import { SceneCard } from "../SceneCard";
import HandleIcon from "./handle.svg";
import * as Style from "./style";

export type SceneBoardProps = {
  sceneId?: string;
};

type DragItemProps = {
  sceneId: string;
};

const DragItem = ({ sceneId }: DragItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sceneId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
    opacity: isDragging ? 0.95 : 1,
  };

  return (
    <Style.SceneItem ref={setNodeRef} style={style}>
      <button
        ref={setActivatorNodeRef}
        type="button"
        aria-label="Drag scene card"
        {...attributes}
        {...listeners}
      >
        <HandleIcon />
      </button>
      <div>
        <SceneCard sceneId={sceneId} />
      </div>
    </Style.SceneItem>
  );
};

/**
 * SceneBoard description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered SceneBoard component.
 */
export const SceneBoard = ({ sceneId }: SceneBoardProps) => {
  const { scenes } = useStory();
  void sceneId;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const sortedScenes = useMemo(() => {
    return [...scenes].sort((a, b) => a.order - b.order);
  }, [scenes]);

  const sceneMap = useMemo(() => {
    return new Map(sortedScenes.map((scene) => [scene.id, scene]));
  }, [sortedScenes]);

  const sortedSceneIds = useMemo(() => {
    return sortedScenes.map((scene) => scene.id);
  }, [sortedScenes]);

  const [orderedSceneIds, setOrderedSceneIds] =
    useState<string[]>(sortedSceneIds);

  useEffect(() => {
    setOrderedSceneIds((current) => {
      const activeIds = new Set(sortedSceneIds);
      const retained = current.filter((id) => activeIds.has(id));
      const missing = sortedSceneIds.filter((id) => !retained.includes(id));

      return [...retained, ...missing];
    });
  }, [sortedSceneIds]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setOrderedSceneIds((current) => {
      const oldIndex = current.indexOf(String(active.id));
      const newIndex = current.indexOf(String(over.id));

      if (oldIndex === -1 || newIndex === -1) {
        return current;
      }

      return arrayMove(current, oldIndex, newIndex);
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={orderedSceneIds} strategy={rectSortingStrategy}>
        <Style.Container>
          {orderedSceneIds.map((id) => {
            const scene = sceneMap.get(id);
            if (!scene) {
              return null;
            }

            return <DragItem key={scene.id} sceneId={scene.id} />;
          })}
        </Style.Container>
      </SortableContext>
    </DndContext>
  );
};
