import React, { useState } from 'react'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'
import { RadioGroup, RadioItem } from 'components/RadioGroup'

import ShowingStepAccessInformationForm from './ShowingStepAccessInformationForm'
import useQuestionWizardSmartNext from '../use-question-wizard-smart-next'

interface ShowingStepAccessInformationProps {
  value: Nullable<string>
  onChange: (value: Nullable<string>) => void
}

type RadioValue = 'Yes' | 'No'

function ShowingStepAccessInformation({
  value,
  onChange
}: ShowingStepAccessInformationProps) {
  const nextStep = useQuestionWizardSmartNext()

  const [radioValue, setRadioValue] = useState<Nullable<RadioValue>>(null)

  const handleChange = (newValue: RadioValue) => {
    if (newValue === 'No') {
      onChange(null)
      nextStep()
    }

    setRadioValue(newValue)
  }

  const handleSubmit = (value: string) => {
    onChange(value)
    nextStep()
  }

  const options: RadioItem<RadioValue>[] = [
    {
      label: 'Yes',
      value: 'Yes',
      children: (radioValue === null || radioValue === 'Yes') && (
        <ShowingStepAccessInformationForm
          value={value || ''}
          onSubmit={handleSubmit}
        />
      )
    },
    {
      label: 'No',
      value: 'No'
    }
  ]

  return (
    <QuestionSection>
      <QuestionTitle>
        Are there any access information you’d like to provide?
      </QuestionTitle>
      <QuestionForm>
        <RadioGroup
          name="accessInfoStatus"
          value={radioValue}
          options={options}
          onChange={handleChange}
        />
      </QuestionForm>
    </QuestionSection>
  )
}

export default ShowingStepAccessInformation
