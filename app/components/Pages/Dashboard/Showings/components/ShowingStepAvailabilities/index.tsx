import React, { memo } from 'react'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'

import ShowingAvailabilitiesTimes from '../ShowingAvailabilitiesTimes'

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
      <QuestionForm width="70%">
        <ShowingAvailabilitiesTimes value={value} onChange={onChange} />
      </QuestionForm>
    </QuestionSection>
  )
}

export default memo(ShowingStepAvailabilities)
