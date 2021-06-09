import { useCallback } from 'react'

import { useWizardContext, useSectionContext } from 'components/QuestionWizard'

const DELAY_IN_MS = 1000

export function useGoNextStep() {
  const wizard = useWizardContext()
  const { step } = useSectionContext()

  return useCallback(
    (withDelay?: boolean) => {
      if (step === wizard.currentStep) {
        wizard.next(withDelay ? DELAY_IN_MS : undefined)
      }
    },
    [step, wizard]
  )
}
