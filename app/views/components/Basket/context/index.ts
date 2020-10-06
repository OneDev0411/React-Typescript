import { createContext } from 'react'

interface IStateContext<T = unknown> {
  selections: T[]
  toggleItem: (item: unknown) => void
  addItem: (item: unknown) => void
  removeItem: (item: unknown) => void
  reinitialize: (items: unknown[]) => void
}

export const StateContext = createContext<IStateContext>({
  selections: [],
  toggleItem: () => {},
  addItem: () => {},
  removeItem: () => {},
  reinitialize: () => {}
})
