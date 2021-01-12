import React from 'react'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { useWizardForm } from 'components/QuestionWizard/use-context'

import { RadioGroup } from 'components/RadioGroup'

import { useFormContext } from '../../context/use-form-context'

interface Props {
  step?: number
}

export function DealType({ step }: Props) {
  const wizard = useWizardForm()
  const context = useFormContext()

  const handleChange = (value: IDealType) => {
    wizard.next()
    context.updateForm({
      side: value
    })
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>Who are you repersenting?</QuestionTitle>
      <QuestionForm>
        <RadioGroup
          name="DealType"
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
