import { useCallback } from 'react'

import { useWizardContext, useSectionContext } from 'components/QuestionWizard'

type UseQuestionWizardSmartNextReturn = (delay?: number) => void

function useQuestionWizardSmartNext(): UseQuestionWizardSmartNextReturn {
  const wizard = useWizardContext()
  const { step } = useSectionContext()

  return useCallback(
    (delay?: number) => {
      if (step === wizard.currentStep) {
        wizard.next(delay)
      }
    },
    [step, wizard]
  )
}

export default useQuestionWizardSmartNext
