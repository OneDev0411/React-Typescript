import { useContext } from 'react'

import { SectionErrorContext } from '../context'

export function useSectionErrorContext(): Optional<string> {
  return useContext(SectionErrorContext)
}
