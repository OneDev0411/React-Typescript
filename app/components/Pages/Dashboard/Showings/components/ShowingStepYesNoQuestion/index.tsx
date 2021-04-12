import React, { memo } from 'react'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'
import { RadioGroup, RadioItem } from 'components/RadioGroup'

import useQuestionWizardSmartNext from '../use-question-wizard-smart-next'

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
  const nextStep = useQuestionWizardSmartNext()

  const handleChange = (value: YesNoAnswer) => {
    onChange(value)
    nextStep()
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

export default memo(ShowingStepYesNoQuestion)
