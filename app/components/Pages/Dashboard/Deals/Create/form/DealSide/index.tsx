import React from 'react'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { useWizardForm } from 'components/QuestionWizard/use-context'

import { RadioGroup } from '../../components/RadioGroup'

interface Props {
  step?: number
  onChange: (dealSide: string) => void
}

export function DealSide({ step, onChange }: Props) {
  const wizard = useWizardForm()

  const handleChange = (value: string) => {
    wizard.next()
    onChange(value)
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>Who are you repersenting?</QuestionTitle>
      <QuestionForm>
        <RadioGroup
          name="DealSide"
          options={[
            {
              label: 'Buyer (or Tenant)',
              value: 'Buying'
            },
            {
              label: 'Seller (or Landlord)',
              value: 'Selling'
            }
          ]}
          onChange={handleChange}
        />
      </QuestionForm>
    </QuestionSection>
  )
}
