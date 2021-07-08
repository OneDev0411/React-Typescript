import { QuestionForm, QuestionFormProps } from 'components/QuestionWizard'
import useIsMobile from 'hooks/use-is-mobile'

type SmartQuestionFormProps = QuestionFormProps

function SmartQuestionForm({ width, ...otherProps }: SmartQuestionFormProps) {
  const isMobile = useIsMobile()

  return <QuestionForm {...otherProps} width={isMobile ? '100%' : width} />
}

export default SmartQuestionForm
