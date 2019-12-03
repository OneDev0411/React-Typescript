import { ReactNode, useState } from 'react'

import cuid from 'cuid'

import { EditorToolbarContextApi, ToolbarFragment } from '../types'

export function useCreateToolbarContext() {
  const [toolbarFragments, setToolbarFragments] = useState<
    Record<string, ToolbarFragment>
  >({})

  const toolbarContext: EditorToolbarContextApi = {
    createToolbarFragment: () => {
      const key = cuid()

      return {
        update: (node: ReactNode, group = 'default') => {
          if (toolbarFragments[key] !== node) {
            setToolbarFragments(toolbarSegments => ({
              ...toolbarSegments,
              [key]: { group, node }
            }))
          }
        },
        remove: () => {
          setToolbarFragments(toolbarSegments => {
            const newToolbarSegments = { ...toolbarSegments }

            delete newToolbarSegments[key]

            return newToolbarSegments
          })
        }
      }
    }
  }

  return { toolbarContext, toolbarFragments }
}
