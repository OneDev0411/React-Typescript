import React from 'react'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle,
  useWizardContext
} from 'components/QuestionWizard'
import { RadioGroup, RadioItem } from 'components/RadioGroup'

export type YesNoAnswer = 'Yes' | 'No'

interface ShowingStepYesNoQuestionProps {
  question: string
  value: Nullable<YesNoAnswer>
  onChange: (value: YesNoAnswer) => void
}

const yesNoOptions: RadioItem<YesNoAnswer>[] = [
  {
    label: 'Yes',
    value: 'Yes'
  },
  {
    label: 'No',
    value: 'No'
  }
]

function ShowingStepYesNoQuestion({
  question,
  value,
  onChange
}: ShowingStepYesNoQuestionProps) {
  const wizard = useWizardContext()

  const handleChange = (value: YesNoAnswer) => {
    onChange(value)
    wizard.next()
  }

  return (
    <QuestionSection>
      <QuestionTitle>{question}</QuestionTitle>
      <QuestionForm>
        <RadioGroup
          defaultValue={value}
          name="approvalType"
          options={yesNoOptions}
          onChange={handleChange}
        />
      </QuestionForm>
    </QuestionSection>
  )
}

export default ShowingStepYesNoQuestion
