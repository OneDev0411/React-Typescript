import { useContext } from 'react'

import {
  DocumentRepositoryContext,
  IDocumentRepositoryContext
} from './document-repository'

export function useDocumentRepositoryContext() {
  return useContext(DocumentRepositoryContext) as IDocumentRepositoryContext
}
