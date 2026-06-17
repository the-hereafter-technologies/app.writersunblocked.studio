"use client";
import { useModal } from "@writersunblocked/ui";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { DeleteProject } from "./delete-project";
import * as Style from "./style";

export interface ProjectItemProps {
  storyId: string;
  href: string;
  title: string;
  wordCount: number;
  lastEdited: string;
}

/**
 * ProjectItem description
 *
 * @param {Object} props - The properties object.
 * @param {string} props.href - The URL of the project.
 * @param {string} props.title - The title of the project.
 * @param {number} props.wordCount - The word count of the project.
 * @param {string} props.lastEdited - The last edited date of the project.
 * @returns {JSX.Element} The rendered ProjectItem component.
 */
export const ProjectItem = ({
  storyId,
  href,
  title,
  wordCount,
  lastEdited,
}: ProjectItemProps) => {
  const router = useRouter();

  const wordCountLine = useMemo(
    () => `${wordCount} word${wordCount !== 1 ? "s" : ""}`,
    [wordCount]
  );
  const lastEditedLine = useMemo(
    () => `Last edited ${moment(lastEdited).fromNow()}`,
    [lastEdited]
  );

  const { open, close, render } = useModal();

  const handleDelete = useCallback(() => {
    render(<DeleteProject storyId={storyId} onClose={close} />);
    open();
  }, [render, open, close, storyId]);

  return (
    <Style.Container>
      <Link href={href}>
        <h3>{title}</h3>
        <Style.Stats>
          <span>{wordCountLine}</span>
          <span>{lastEditedLine}</span>
        </Style.Stats>
      </Link>
      <Style.MenuButton
        data={[
          {
            label: "Edit story",
            onClick: () => {
              router.push(href);
            },
          },
          {
            label: "Delete story",
            onClick: () => {
              // Implement delete functionality here
              handleDelete();
            },
          },
        ]}
        render={(item) => (
          <button type="button" onClick={item.onClick}>
            {item.label}
          </button>
        )}
      />
    </Style.Container>
  );
};
