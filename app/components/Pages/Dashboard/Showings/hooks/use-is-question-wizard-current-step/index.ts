import { useSectionContext, useWizardContext } from 'components/QuestionWizard'

function useIsQuestionWizardCurrentStep(): boolean {
  const wizard = useWizardContext()
  const { step } = useSectionContext()

  return wizard.currentStep === step
}

export default useIsQuestionWizardCurrentStep
