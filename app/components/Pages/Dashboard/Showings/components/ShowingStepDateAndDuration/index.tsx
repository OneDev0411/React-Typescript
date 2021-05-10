import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'

import useQuestionWizardSmartNext from '../../hooks/use-question-wizard-smart-next'

import ShowingDateAndDurationForm from '../ShowingDateAndDurationForm'

interface ShowingStepDateAndDurationProps {
  value: Nullable<IShowingDateDurationInput>
  onChange: (data: IShowingDateDurationInput) => void
}

function ShowingStepDateAndDuration({
  value,
  onChange
}: ShowingStepDateAndDurationProps) {
  const next = useQuestionWizardSmartNext()

  const handleSubmit = (values: IShowingDateDurationInput) => {
    onChange(values)
    next()
  }

  return (
    <QuestionSection>
      <QuestionTitle>Please select the date and duration</QuestionTitle>
      <QuestionForm>
        <ShowingDateAndDurationForm
          initialValues={value ?? undefined}
          onSubmit={handleSubmit}
        />
      </QuestionForm>
    </QuestionSection>
  )
}

export default ShowingStepDateAndDuration
