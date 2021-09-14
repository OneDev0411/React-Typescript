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
      } else if (step === wizard.lastVisitedStep) {
        wizard.setStep(step + 1)
      }
    },
    [step, wizard]
  )
}

export default useQuestionWizardSmartNext
