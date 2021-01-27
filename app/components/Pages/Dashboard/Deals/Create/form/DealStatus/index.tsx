import React from 'react'
import { CircularProgress } from '@material-ui/core'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'

import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'

import { RadioGroup } from 'components/RadioGroup'

interface Props {
  list: IDealStatus[]
  onChange: (value: string) => void
}

export function DealStatus({ list, onChange }: Props) {
  const wizard = useWizardContext()
  const { step } = useSectionContext()

  const handleChange = (value: string) => {
    onChange(value)

    if (wizard.currentStep === step) {
      wizard.next()
    }
  }

  if (wizard.lastVisitedStep < step) {
    return null
  }

  if (list.length === 0) {
    return <CircularProgress />
  }

  return (
    <QuestionSection>
      <QuestionTitle>What is the status of the deal?</QuestionTitle>

      <QuestionForm>
        <RadioGroup
          name="DealType"
          options={list.map(status => ({
            label: status.label,
            value: status.label
          }))}
          onChange={handleChange}
        />
      </QuestionForm>
    </QuestionSection>
  )
}
