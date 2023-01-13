import { useContext } from 'react'

import {
  DocumentRepositorySelectionContext,
  IDocumentRepositorySelectionContext
} from './document-repository-selection'

export function useDocumentRepositorySelectionContext() {
  return useContext(
    DocumentRepositorySelectionContext
  ) as IDocumentRepositorySelectionContext
}
