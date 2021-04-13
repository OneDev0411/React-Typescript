import React, { memo } from 'react'

import { QuestionSection, QuestionTitle } from 'components/QuestionWizard'

import ShowingAvailabilitiesTimes from '../ShowingAvailabilitiesTimes'
import SmartQuestionForm from '../SmartQuestionForm'

interface ShowingStepAvailabilitiesProps {
  value: IShowingAvailabilityInput[]
  onChange: (value: IShowingAvailabilityInput[]) => void
}

function ShowingStepAvailabilities({
  value,
  onChange
}: ShowingStepAvailabilitiesProps) {
  return (
    <QuestionSection>
      <QuestionTitle>When you’re available for this showing?</QuestionTitle>
      <SmartQuestionForm width="70%">
        <ShowingAvailabilitiesTimes value={value} onChange={onChange} />
      </SmartQuestionForm>
    </QuestionSection>
  )
}

export default memo(ShowingStepAvailabilities)
