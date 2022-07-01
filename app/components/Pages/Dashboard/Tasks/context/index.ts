import { createContext } from 'react'

export interface TasksListFilters {
  q?: string
  assignees?: IUser[]
  type?: CRMTaskTypes
  status?: string
  dueDate?: {
    from?: Date
    to?: Date
  }
}
export interface Context {
  sortBy: string
  filter: Partial<TasksListFilters>
  setFilter: (data: Partial<TasksListFilters>) => void
  setSortBy: (sortBy: string) => void
}

export const TasksListContext = createContext<Context | undefined>(undefined)
