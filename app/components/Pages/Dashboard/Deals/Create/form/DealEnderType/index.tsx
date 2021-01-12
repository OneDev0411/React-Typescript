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

export function DealEnderType({ step }: Props) {
  const wizard = useWizardForm()
  const context = useFormContext()

  const handleChange = (value: IDealEnderType) => {
    wizard.next()
    context.updateForm({
      enderType: value
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
              label: 'No',
              value: null
            },
            {
              label: 'Yes, I represent both sides',
              value: 'AgentDoubleEnder'
            },
            {
              label:
                'Yes, another agent from my office is on the other side of this deal',
              value: 'OfficeDoubleEnder'
            }
          ]}
          onChange={handleChange}
        />
      </QuestionForm>
    </QuestionSection>
  )
}
