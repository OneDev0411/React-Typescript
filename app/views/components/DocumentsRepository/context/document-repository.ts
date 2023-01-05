import { createContext } from 'react'

export interface IDocumentRepositoryContext {
  isFetching: boolean
  searchCriteria: string
  activeCategoryIndex: Nullable<number>
  categoryNames: string[]
  forms: Record<string, IBrandForm[]>
}

export const DocumentRepositoryContext = createContext<
  IDocumentRepositoryContext | undefined
>(undefined)
