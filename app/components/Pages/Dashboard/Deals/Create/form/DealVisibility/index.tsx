import React from 'react'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'

import { RadioGroup } from 'components/RadioGroup'

export function DealVisibility() {
  const wizard = useWizardContext()
  const { step } = useSectionContext()

  const handleChange = (value: 'draft' | 'visible') => {
    if (wizard.currentStep === step) {
      wizard.next()
    }

    // context.updateForm!({
    //   visibility: value
    // })
  }

  return (
    <QuestionSection>
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
