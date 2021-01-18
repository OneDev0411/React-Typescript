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

export function DealVisibility({ step }: Props) {
  const wizard = useWizardForm()
  const context = useFormContext()

  const handleChange = (value: 'draft' | 'visible') => {
    if (wizard.currentStep === step) {
      wizard.next()
    }

    context.updateForm({
      visibility: value
    })
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>What is the stage of this deal?</QuestionTitle>
      <QuestionForm>
        <RadioGroup
          name="DealType"
          options={[
            {
              label: 'Visible To Admin',
              value: 'visible',
              description:
                'This deal is ready and I want to start submitting paperwork'
            },
            {
              label: 'NOT Visible To Admin',
              value: 'draft',
              description:
                'This deal is in an early stage and paperwork has just started'
            }
          ]}
          onChange={handleChange}
        />
      </QuestionForm>
    </QuestionSection>
  )
}
