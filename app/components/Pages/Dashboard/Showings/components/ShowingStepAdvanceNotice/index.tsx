import React, { memo, useState } from 'react'

import {
  QuestionSection,
  QuestionTitle,
  useSectionContext,
  useWizardContext
} from 'components/QuestionWizard'
import { RadioGroup, RadioGroupProps } from 'components/RadioGroup'

import ShowingStepAdvanceNoticeLeadTimeOptions, {
  hourOptions
} from './ShowingStepAdvanceNoticeLeadTimeOptions'
import useQuestionWizardSmartNext from '../use-question-wizard-smart-next'
import SmartQuestionForm from '../SmartQuestionForm'

type AdvanceNoticeValue = 'NoNeed' | 'NoSameDay' | 'LeadTime'

interface ShowingStepAdvanceNoticeProps {
  noticePeriod: Nullable<number>
  onNoticePeriodChange: (noticePeriod: Nullable<number>) => void
  sameDayAllowed: boolean
  onSameDayAllowedChange: (sameDayAllowed: boolean) => void
}

function ShowingStepAdvanceNotice({
  noticePeriod,
  sameDayAllowed,
  onNoticePeriodChange,
  onSameDayAllowedChange
}: ShowingStepAdvanceNoticeProps) {
  const nextStep = useQuestionWizardSmartNext()
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const [radioValue, setRadioValue] = useState<Nullable<AdvanceNoticeValue>>(
    !sameDayAllowed ? 'NoSameDay' : noticePeriod ? 'LeadTime' : null
  )

  const handleChange = (value: AdvanceNoticeValue) => {
    onSameDayAllowedChange(value !== 'NoSameDay')

    if (value !== 'LeadTime') {
      onNoticePeriodChange(value === 'NoNeed' ? 0 : null)
      nextStep()
    }

    // Try to have a period notice when the selected option is lead time
    // the user passed this step before
    if (value === 'LeadTime' && step !== wizard.currentStep) {
      onNoticePeriodChange(hourOptions[0].value)
    }

    setRadioValue(value)
  }

  const handleLeadTimeChange = (noticePeriod: number) => {
    onSameDayAllowedChange(true)
    onNoticePeriodChange(noticePeriod)
    nextStep()
  }

  const options: RadioGroupProps<AdvanceNoticeValue>['options'] = [
    {
      label: 'No need for advance notice',
      value: 'NoNeed'
    },
    {
      label: 'No same day appointments',
      value: 'NoSameDay'
    },
    {
      label: 'Lead Time:',
      value: 'LeadTime',
      children: (!radioValue || radioValue === 'LeadTime') && (
        <ShowingStepAdvanceNoticeLeadTimeOptions
          value={noticePeriod}
          onChange={handleLeadTimeChange}
        />
      )
    }
  ]

  return (
    <QuestionSection>
      <QuestionTitle>Is there a need for advance notice?</QuestionTitle>
      <SmartQuestionForm>
        <RadioGroup<AdvanceNoticeValue>
          name="advanceNotice"
          options={options}
          value={radioValue}
          onChange={handleChange}
        />
      </SmartQuestionForm>
    </QuestionSection>
  )
}

export default memo(ShowingStepAdvanceNotice)
