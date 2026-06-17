import { MentionOptions } from '@tiptap/extension-mention'
import { nestApiRequest } from '@/lib/nest-api'

interface CharacterSuggestion {
  id: string
  name: string
  mentionCount: number
  color: string
}

export function buildMentionSuggestion(
  storyId: string,
  onNewCharacter: (query: string) => void
): MentionOptions['suggestion'] {
  return {
    items: async ({ query }: { query: string }) => {
      try {
        const story = await nestApiRequest<{ characters?: CharacterSuggestion[] }>({
          path: `/stories/${storyId}`,
        })
        const characters: CharacterSuggestion[] = story.characters ?? []
        const filtered = characters.filter((c) =>
          c.name.toLowerCase().includes(query.toLowerCase())
        )
        // Append the "New character" sentinel
        return [
          ...filtered,
          { id: '__new__', name: query || 'New character…', mentionCount: 0, color: '' },
        ]
      } catch {
        return [{ id: '__new__', name: 'New character…', mentionCount: 0, color: '' }]
      }
    },
    command: ({ editor, range, props }: any) => {
      if (props?.id === '__new__') {
        onNewCharacter(props?.name ?? '')
        return
      }

      editor
        .chain()
        .focus()
        .insertContentAt(range, [
          {
            type: 'mention',
            attrs: {
              id: props.id,
              label: props.name,
              color: props.color,
            },
          },
          { type: 'text', text: ' ' },
        ])
        .run()
    },
  }
}
