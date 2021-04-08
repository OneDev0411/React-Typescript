import React from 'react'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'

import ShowingAvailabilitiesTimes from '../ShowingAvailabilitiesTimes'

interface ShowingStepAvailabilitiesProps {
  value: IShowingAvailabilitySlot[]
  onChange: (value: IShowingAvailabilitySlot[]) => void
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

export default ShowingStepAvailabilities
