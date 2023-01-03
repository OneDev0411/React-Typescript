import { useContext } from 'react'

import { DocumentRepositoryContext, IDocumentRepositoryContext } from '.'

export function useDocumentRepositoryContext() {
  return useContext(DocumentRepositoryContext) as IDocumentRepositoryContext
}
