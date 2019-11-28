import { ReactNode, useState } from 'react'

import cuid from 'cuid'

import { EditorToolbarContextApi, ToolbarFragment } from '../types'

export function useCreateToolbarContext() {
  const [toolbarSegments, setToolbarSegments] = useState<
    Record<string, ToolbarFragment>
  >({})

  const toolbarContext: EditorToolbarContextApi = {
    createToolbarSegment: () => {
      const key = cuid()

      return {
        update: (node: ReactNode, group = 'default') => {
          if (toolbarSegments[key] !== node) {
            setToolbarSegments(toolbarSegments => ({
              ...toolbarSegments,
              [key]: { group, node }
            }))
          }
        },
        remove: () => {
          setToolbarSegments(toolbarSegments => {
            const newToolbarSegments = { ...toolbarSegments }

            delete newToolbarSegments[key]

            return newToolbarSegments
          })
        }
      }
    }
  }

  return { toolbarContext, toolbarSegments }
}
