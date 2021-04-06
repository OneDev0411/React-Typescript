import { useWizardContext, useSectionContext } from 'components/QuestionWizard'

type UseQuestionWizardSmartNextReturn = () => void

function useQuestionWizardSmartNext(): UseQuestionWizardSmartNextReturn {
  const wizard = useWizardContext()
  const { step } = useSectionContext()

  return () => {
    if (step === wizard.currentStep) {
      wizard.next()
    }
  }
}

export default useQuestionWizardSmartNext
