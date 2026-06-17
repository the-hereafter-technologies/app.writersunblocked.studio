"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import styled from "styled-components";

interface CharacterOption {
  id: string;
  name: string;
  mentionCount: number;
  color: string;
}

interface MentionListProps {
  items: CharacterOption[];
  command: (item: { id: string; label: string }) => void;
  onNewCharacter?: (query: string) => void;
}

const List = styled.div`
  background: ${({ theme }) => theme.palette.brand.darkPaper};
  border: 1px solid ${({ theme }) => theme.palette.brand.black};
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 4px;
  min-width: 160px;
  max-width: 240px;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  overflow: hidden;
`;

const Item = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  border: none;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.palette.brand.darkPaper : "transparent"};
  color: ${({ theme }) => theme.palette.brand.black};
  cursor: pointer;
  border-radius: 12px;
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.palette.brand.silver};
  }
`;

const Initials = styled.span<{ color: string }>`
  width: 22px;
  height: 22px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  /* we need to restore highlits */
  flex-shrink: 0;
`;

const NewItem = styled(Item)`
  color: ${({ theme }) => theme.palette.brand.silver};
  border-top: 1px solid ${({ theme }) => theme.palette.brand.black};
  margin-top: 2px;
  padding-top: 8px;
`;

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const MentionList = forwardRef<any, MentionListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const realItems = props.items.filter((i) => i.id !== "__new__");
  const hasNew = props.items.some((i) => i.id === "__new__");
  const newItem = props.items.find((i) => i.id === "__new__");
  const allItems = [...realItems, ...(hasNew && newItem ? [newItem] : [])];

  const selectItem = (index: number) => {
    const item = allItems[index];
    if (!item) return;

    if (item.id === "__new__") {
      props.onNewCharacter?.(item.name === "New character…" ? "" : item.name);
    } else {
      props.command({ id: item.id, label: item.name });
    }
  };
  // Reset the selected index whenever the items change
  // biome-ignore lint: This effect is safe to ignore
  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown({ event }: { event: KeyboardEvent }) {
      if (event.key === "ArrowUp") {
        setSelectedIndex((i) => (i - 1 + allItems.length) % allItems.length);
        return true;
      }
      if (event.key === "ArrowDown") {
        setSelectedIndex((i) => (i + 1) % allItems.length);
        return true;
      }
      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  if (allItems.length === 0) return null;

  return (
    <List>
      {realItems.map((item, index) => (
        <Item
          key={item.id}
          $isActive={index === selectedIndex}
          onClick={() => selectItem(index)}
        >
          <Initials color={item.color}>
            {item.name.slice(0, 2).toUpperCase()}
          </Initials>
          {item.name}
        </Item>
      ))}
      {hasNew && newItem && (
        <NewItem
          $isActive={selectedIndex === realItems.length}
          onClick={() => selectItem(realItems.length)}
        >
          +{" "}
          {newItem.name === "New character…"
            ? "New character…"
            : `Create "${capitalize(newItem.name)}"`}
        </NewItem>
      )}
    </List>
  );
});

MentionList.displayName = "MentionList";

export default MentionList;
