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
import useQuestionWizardSmartNext from '../../hooks/use-question-wizard-smart-next'
import useIsQuestionWizardCurrentOrLastVisitedStep from '../../hooks/use-is-question-wizard-current-or-last-visited-step'

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
  const isCurrentStep = useIsQuestionWizardCurrentOrLastVisitedStep()
  const nextStep = useQuestionWizardSmartNext()

  return (
    <QuestionSection error={error} displayError>
      <QuestionTitle>When you’re available for this showing?</QuestionTitle>
      <SmartQuestionForm width="70%">
        <ShowingDuration
          value={duration}
          onChange={onDurationChange}
          marginBottom={4}
        />
        <ShowingAvailabilitiesTimes
          showingDuration={duration}
          value={availabilities}
          onChange={onAvailabilitiesChange}
          hasContinue={isCurrentStep}
          disabledContinue={!!error}
          onContinue={nextStep}
        />
      </SmartQuestionForm>
    </QuestionSection>
  )
}

export default memo(ShowingStepDurationAndAvailabilities)
