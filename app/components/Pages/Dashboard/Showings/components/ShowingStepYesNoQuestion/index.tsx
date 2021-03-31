import React from 'react'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
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
  return (
    <QuestionSection>
      <QuestionTitle>{question}</QuestionTitle>
      <QuestionForm>
        <RadioGroup
          defaultValue={value}
          name="approvalType"
          options={yesNoOptions}
          onChange={onChange}
        />
      </QuestionForm>
    </QuestionSection>
  )
}

export default ShowingStepYesNoQuestion
