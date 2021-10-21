import { createContext } from 'react'

export interface Context {
  list: Record<string, IContact[]>
  updateList: (contacts: IContact[], name?: string) => void
}

export const BoardContext = createContext<Context>({
  list: {},
  updateList: () => {}
})
