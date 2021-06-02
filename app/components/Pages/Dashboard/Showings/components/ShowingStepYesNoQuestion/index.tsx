import React, { memo } from 'react'

import { QuestionSection, QuestionTitle } from 'components/QuestionWizard'

import useQuestionWizardSmartNext from '../../hooks/use-question-wizard-smart-next'
import SmartQuestionForm from '../SmartQuestionForm'
import ShowingYesNoRadioGroup, {
  ShowingYesNoRadioGroupProps
} from '../ShowingYesNoRadioGroup'

export type YesNoAnswer = 'Yes' | 'No'

interface ShowingStepYesNoQuestionProps
  extends Pick<ShowingYesNoRadioGroupProps, 'yesLabel' | 'noLabel' | 'name'> {
  question: string
  value: Nullable<YesNoAnswer>
  onChange: (value: YesNoAnswer) => void
  goNext?: boolean
}

function ShowingStepYesNoQuestion({
  question,
  value,
  onChange,
  goNext = true,
  yesLabel,
  noLabel,
  name
}: ShowingStepYesNoQuestionProps) {
  const nextStep = useQuestionWizardSmartNext()

  const handleChange = (value: YesNoAnswer) => {
    onChange(value)

    if (goNext) {
      nextStep()
    }
  }

  return (
    <QuestionSection>
      <QuestionTitle>{question}</QuestionTitle>
      <SmartQuestionForm>
        <ShowingYesNoRadioGroup
          name={name}
          defaultValue={value}
          onChange={handleChange}
          yesLabel={yesLabel}
          noLabel={noLabel}
        />
      </SmartQuestionForm>
    </QuestionSection>
  )
}

export default memo(ShowingStepYesNoQuestion)
