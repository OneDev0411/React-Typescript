import { useContext } from 'react'

import { BoardContext, Context } from '../context'

export function useColumnList(
  listName = 'all'
): [IContact[], Context['updateList']] {
  const context = useContext(BoardContext)

  const updateList = (contacts: IContact[]) => {
    context.updateList(contacts, listName)
  }

  return [context.list[listName] ?? [], updateList]
}
