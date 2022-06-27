import { createContext } from 'react'

export interface Context {
  sortBy: string
  setSortBy: (value: string) => void
}

export const TasksListContext = createContext<Context | undefined>(undefined)
