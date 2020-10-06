import { createContext } from 'react'

interface StateContext {
  selections: IListing[]
  toggleItem: (item: IListing) => void
  addItem: (item: IListing) => void
  removeItem: (item: IListing) => void
  reinitialize: (items: IListing[]) => void
}

export const StateContext = createContext<StateContext>({
  selections: [],
  toggleItem: () => {},
  addItem: () => {},
  removeItem: () => {},
  reinitialize: () => {}
})
