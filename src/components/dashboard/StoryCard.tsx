'use client'

import React from 'react'
import styled from 'styled-components'

interface StoryCardProps {
  story: {
    id: string
    title: string
    wordCount: number
    lastEditedAt: string
  }
  onOpen: (id: string) => void
}

const Card = styled.button`
  width: 100%;
  text-align: left;
  border: 1px solid ${({ theme }) => theme.palette.brand.black};
  background: ${({ theme }) => theme.palette.brand.darkPaper};
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.palette.brand.silver};
    transform: translateY(-1px);
  }
`

const Title = styled.h3`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 20px;
  color: ${({ theme }) => theme.palette.brand.black};
  margin-bottom: 8px;
`

const Meta = styled.p`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 12px;
  color: ${({ theme }) => theme.palette.brand.paper};
`

export default function StoryCard({ story, onOpen }: StoryCardProps) {
  const edited = new Date(story.lastEditedAt)
  return (
    <Card onClick={() => onOpen(story.id)}>
      <Title>{story.title || 'Untitled'}</Title>
      <Meta>
        {story.wordCount} words · edited {edited.toLocaleDateString()}
      </Meta>
    </Card>
  )
}
