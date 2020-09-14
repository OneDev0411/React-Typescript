import { ReactNode, useContext, useEffect, useMemo } from 'react'

import { EditorToolbarContext } from '../editor-context'
import { ToolbarFragmentGroup } from '../types'

interface Props {
  children: ReactNode
  group?: ToolbarFragmentGroup
}

export function ToolbarFragment({ children, group }: Props) {
  const { createToolbarFragment } = useContext(EditorToolbarContext)
  const { update, remove } = useMemo(createToolbarFragment, [])

  useEffect(() => {
    update(children, group)

    return remove
  }, [children, update, remove, group])

  return null
}
