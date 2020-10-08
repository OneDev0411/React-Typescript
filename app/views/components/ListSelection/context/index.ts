import { createContext } from 'react'

interface IStateContext<T = unknown> {
  selections: T[]
  toggleItem: (item: T) => void
  addItem: (item: T) => void
  removeItem: (item: T) => void
  reinitialize: (items: T[]) => void
}

export const StateContext = createContext<IStateContext>({
  selections: [],
  toggleItem: () => {},
  addItem: () => {},
  removeItem: () => {},
  reinitialize: () => {}
})
