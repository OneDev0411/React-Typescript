import { useSectionContext, useWizardContext } from 'components/QuestionWizard'

function useIsQuestionWizardCurrentOrLastVisitedStep(): boolean {
  const wizard = useWizardContext()
  const { step } = useSectionContext()

  return wizard.currentStep === step || wizard.lastVisitedStep === step
}

export default useIsQuestionWizardCurrentOrLastVisitedStep
