import { ReactNode, useContext, useEffect, useMemo } from 'react'

import { EditorToolbarContext } from '../editor-context'

interface Props {
  children: ReactNode
  group?: string
}

export function ToolbarFragment({ children, group }: Props) {
  const { createToolbarSegment } = useContext(EditorToolbarContext)
  const { update, remove } = useMemo(createToolbarSegment, [])

  useEffect(() => {
    update(children, group)

    return remove
  }, [children, update, remove, group])

  return null
}
