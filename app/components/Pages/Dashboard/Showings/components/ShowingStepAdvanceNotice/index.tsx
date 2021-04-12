import React, { memo, useState } from 'react'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'
import { RadioGroup, RadioGroupProps } from 'components/RadioGroup'

import ShowingStepAdvanceNoticeLeadTimeOptions from './ShowingStepAdvanceNoticeLeadTimeOptions'
import useQuestionWizardSmartNext from '../use-question-wizard-smart-next'

type AdvanceNoticeValue = 'NoNeed' | 'NoSameDay' | 'LeadTime'

interface ShowingStepAdvanceNoticeProps {
  leadTime: Nullable<number>
  onLeadTimeChange: (leadTime: Nullable<number>) => void
}

function ShowingStepAdvanceNotice({
  leadTime,
  onLeadTimeChange
}: ShowingStepAdvanceNoticeProps) {
  const nextStep = useQuestionWizardSmartNext()
  const [radioValue, setRadioValue] = useState<Nullable<AdvanceNoticeValue>>(
    null
  )

  const handleChange = (value: AdvanceNoticeValue) => {
    if (value !== 'LeadTime') {
      onLeadTimeChange(null)
      nextStep()
    }

    setRadioValue(value)
  }

  const handleLeadTimeChange = (leadTime: number) => {
    onLeadTimeChange(leadTime)
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
          value={leadTime}
          onChange={handleLeadTimeChange}
        />
      )
    }
  ]

  return (
    <QuestionSection>
      <QuestionTitle>Is there a need for advance notice?</QuestionTitle>
      <QuestionForm>
        <RadioGroup<AdvanceNoticeValue>
          name="advanceNotice"
          options={options}
          value={radioValue}
          onChange={handleChange}
        />
      </QuestionForm>
    </QuestionSection>
  )
}

export default memo(ShowingStepAdvanceNotice)
