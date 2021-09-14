import { useContext } from 'react'

import { BoardContext, Context } from '../context'

export function useColumnList(
  listName = 'all'
): [IContact[], Context['updateList']] {
  const context = useContext(BoardContext)

  return [context.list[listName] ?? [], context.updateList]
}
