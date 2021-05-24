import { memo } from 'react'

import {
  QuestionSection,
  QuestionSectionProps,
  QuestionTitle
} from 'components/QuestionWizard'

import ShowingAvailabilitiesTimes, {
  ShowingAvailabilitiesTimesProps
} from '../ShowingAvailabilitiesTimes'
import SmartQuestionForm from '../SmartQuestionForm'
import ShowingDuration, { ShowingDurationProps } from '../ShowingDuration'

interface ShowingStepDurationAndAvailabilitiesProps
  extends Pick<QuestionSectionProps, 'error'> {
  availabilities: ShowingAvailabilitiesTimesProps['value']
  onAvailabilitiesChange: ShowingAvailabilitiesTimesProps['onChange']
  duration: ShowingDurationProps['value']
  onDurationChange: ShowingDurationProps['onChange']
}

function ShowingStepDurationAndAvailabilities({
  duration,
  onDurationChange,
  availabilities,
  onAvailabilitiesChange,
  error
}: ShowingStepDurationAndAvailabilitiesProps) {
  return (
    <QuestionSection error={error}>
      <QuestionTitle>When you’re available for this showing?</QuestionTitle>
      <SmartQuestionForm width="70%">
        <ShowingDuration
          value={duration}
          onChange={onDurationChange}
          marginBottom={4}
        />
        <ShowingAvailabilitiesTimes
          value={availabilities}
          onChange={onAvailabilitiesChange}
        />
      </SmartQuestionForm>
    </QuestionSection>
  )
}

export default memo(ShowingStepDurationAndAvailabilities)
