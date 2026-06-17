"use client";

import React, { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import styled from "styled-components";
import type { ChapterOutlineItem } from "./ChapterExtension";

interface ChapterOutlineProps {
	chapters: ChapterOutlineItem[];
	editor: Editor | null;
	onAddChapter: () => void;
}

const Rail = styled.aside`
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  border-right: 1px solid ${({ theme }) => theme.palette.brand.black};
  background: ${({ theme }) => theme.palette.brand.paper};
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Label = styled.span`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.brand.paper};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.palette.brand.black};
  background: transparent;
  color: ${({ theme }) => theme.palette.brand.black};
  cursor: pointer;
  font-size: 14px;
  line-height: 1;

  &:hover {
    background: ${({ theme }) => theme.palette.brand.silver};
    color: ${({ theme }) => theme.palette.brand.silver};
    border-color: ${({ theme }) => theme.palette.brand.silver};
  }
`;

const ChapterButton = styled.button<{ $active: boolean }>`
  width: 100%;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.palette.brand.silver : theme.palette.brand.black)};
  background: ${({ theme }) => theme.palette.brand.darkPaper};
  border-radius: 12px;
  padding: 12px;
  text-align: left;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.palette.brand.silver};
  }
`;

const ChapterKicker = styled.div`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.palette.brand.paper};
  margin-bottom: 6px;
`;

const ChapterTitle = styled.div`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 1rem;
  color: ${({ theme }) => theme.palette.brand.black};
  line-height: 1.35;
`;

const EmptyState = styled.p`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.palette.brand.paper};
  line-height: 1.6;
  padding-top: 12px;
`;

export default function ChapterOutline({
	chapters,
	editor,
	onAddChapter,
}: ChapterOutlineProps) {
	const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

	useEffect(() => {
		if (!editor) return;

		const updateActiveChapter = () => {
			const from = editor.state.selection.from;
			const current = [...chapters]
				.reverse()
				.find((chapter) => from >= chapter.position);
			setActiveChapterId(current?.id ?? null);
		};

		updateActiveChapter();
		editor.on("selectionUpdate", updateActiveChapter);

		return () => {
			editor.off("selectionUpdate", updateActiveChapter);
		};
	}, [editor, chapters]);

	const jumpToChapter = (chapter: ChapterOutlineItem) => {
		if (!editor) return;
		(editor as any)
			.chain()
			.focus(chapter.position + 1)
			.scrollIntoView()
			.run();
	};

	return (
		<Rail>
			<Header>
				<Label>Chapters</Label>
				<AddButton onClick={onAddChapter} title="Insert chapter">
					+
				</AddButton>
			</Header>

			{chapters.length === 0 ? (
				<EmptyState>Insert a Chapter block to build your outline.</EmptyState>
			) : (
				chapters.map((chapter, index) => (
					<ChapterButton
						key={chapter.id}
						type="button"
						$active={chapter.id === activeChapterId}
						onClick={() => jumpToChapter(chapter)}
					>
						<ChapterKicker>Chapter {index + 1}</ChapterKicker>
						<ChapterTitle>{chapter.title}</ChapterTitle>
					</ChapterButton>
				))
			)}
		</Rail>
	);
}
