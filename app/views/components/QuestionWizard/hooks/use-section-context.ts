import { useContext } from 'react'

import { SectionContext, IWizardSectionState } from '../context'

export function useSectionContext(): IWizardSectionState {
  return useContext(SectionContext) as IWizardSectionState
}
