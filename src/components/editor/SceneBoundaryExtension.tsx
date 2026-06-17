"use client";

import { mergeAttributes, Node } from "@tiptap/core";
import {
  type NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import styled from "styled-components";

const BoundaryShell = styled(NodeViewWrapper)`
  display: block;
  margin: 28px 0 18px;
  padding-top: 16px;
  border-top: 12px solid ${({ theme }) => theme.palette.brand.darkPaper};
  position: relative;
  padding-bottom: 100px;

`;

function SceneBoundaryNodeView(props: NodeViewProps) {
  const title =
    typeof props.node?.attrs?.title === "string" && props.node.attrs.title
      ? props.node.attrs.title
      : "Untitled scene";

  if (props.node?.attrs?.order <= 1) {
    return null; // Don't render the boundary if it's the first one (order 0)
  }

  return (
    <BoundaryShell
      id={props.node?.attrs?.sceneId}
      contentEditable={false}
      data-type="scene-boundary"
      data-scene-id={props.node?.attrs?.sceneId ?? ""}
      data-scene-order={props.node?.attrs?.order ?? 0}
    >
      {/* <BoundaryLabel>{title}</BoundaryLabel> */}
    </BoundaryShell>
  );
}

export const SceneBoundaryExtension = Node.create({
  name: "sceneBoundary",
  group: "block",
  atom: true,
  selectable: true,
  draggable: false,
  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      sceneId: {
        default: null,
      },
      title: {
        default: "Untitled scene",
      },
      order: {
        default: 0,
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="scene-boundary"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "scene-boundary",
        "data-scene-id": HTMLAttributes.sceneId,
        "data-scene-order": HTMLAttributes.order,
      }),
      ["span", { "data-scene-boundary-label": "true" }, HTMLAttributes.title],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SceneBoundaryNodeView);
  },
});
