"use client";

import React from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import type { Editor } from "@tiptap/react";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import styled from "styled-components";

export interface ChapterOutlineItem {
	id: string;
	title: string;
	position: number;
}

function createChapterId() {
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return crypto.randomUUID();
	}

	return `chapter-${Math.random().toString(36).slice(2, 10)}`;
}

const ChapterShell = styled(NodeViewWrapper)<{ $selected: boolean }>`
  display: block;
  margin: 40px 0 24px;
  padding: 18px 0 0;
  border-top: 1px solid ${({ theme }) => theme.palette.brand.black};
  position: relative;

  ${({ $selected, theme }) =>
		$selected &&
		`box-shadow: inset 0 0 0 1px ${theme.palette.brand.darkPaper}; border-radius: 8px; padding-left: 12px; padding-right: 12px;`}
`;

const ChapterLabel = styled.span`
  position: absolute;
  top: -9px;
  left: 0;
  padding: 0 8px;
  background: ${({ theme }) => theme.palette.brand.paper};
  color: ${({ theme }) => theme.palette.brand.paper};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const ChapterInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.palette.brand.black};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 2rem;
  line-height: 1.15;
  font-weight: 600;

  &::placeholder {
    color: ${({ theme }) => theme.palette.brand.paper};
  }
`;

function ChapterNodeView(props: any) {
	const { node, updateAttributes, selected, extension } = props;
	const readOnly = extension.options.readOnly;

	return (
		<ChapterShell
			$selected={selected}
			data-type="chapter"
			contentEditable={false}
		>
			<ChapterLabel>Chapter</ChapterLabel>
			<ChapterInput
				value={node.attrs.title ?? ""}
				placeholder="Untitled Chapter"
				readOnly={readOnly}
				onChange={(event) => updateAttributes({ title: event.target.value })}
			/>
		</ChapterShell>
	);
}

export const ChapterExtension = Node.create({
	name: "chapter",
	group: "block",
	atom: true,
	selectable: true,
	defining: true,

	addOptions() {
		return {
			readOnly: false,
			HTMLAttributes: {},
		};
	},

	addAttributes() {
		return {
			id: {
				default: null,
			},
			title: {
				default: "Untitled Chapter",
			},
		};
	},

	parseHTML() {
		return [{ tag: 'div[data-type="chapter"]' }];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			"div",
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				"data-type": "chapter",
			}),
			["span", { "data-chapter-label": "true" }, "Chapter"],
			[
				"h2",
				{ "data-chapter-title": "true" },
				HTMLAttributes.title || "Untitled Chapter",
			],
		];
	},

	addCommands() {
		return {
			insertChapter:
				() =>
				({ commands }: any) =>
					commands.insertContent([
						{
							type: this.name,
							attrs: {
								id: createChapterId(),
								title: "Untitled Chapter",
							},
						},
						{
							type: "paragraph",
						},
					]),
		} as any;
	},

	addNodeView() {
		return ReactNodeViewRenderer(ChapterNodeView);
	},
});

export function extractChaptersFromEditor(
	editor: Editor | null,
): ChapterOutlineItem[] {
	if (!editor) return [];

	const chapters: ChapterOutlineItem[] = [];

	editor.state.doc.descendants((node, position) => {
		if (node.type.name !== "chapter") return true;

		chapters.push({
			id: node.attrs.id ?? createChapterId(),
			title: node.attrs.title?.trim() || "Untitled Chapter",
			position,
		});

		return true;
	});

	return chapters;
}
