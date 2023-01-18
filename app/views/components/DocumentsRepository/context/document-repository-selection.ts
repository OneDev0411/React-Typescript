import { createContext } from 'react'

export interface IDocumentRepositorySelectionContext {
  selectionState: Record<string, Record<string, boolean>>
  selectedForms: UUID[]
  isBulkActionWorking: boolean
  setIsBulkActionWorking: (state: boolean) => void
}

export const DocumentRepositorySelectionContext = createContext<
  IDocumentRepositorySelectionContext | undefined
>(undefined)
