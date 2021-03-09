import React, { ChangeEvent } from 'react'

import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'
import { useWizardForm } from 'components/QuestionWizard/use-context'

export enum DomainStatusType {
  New = 'New',
  Existing = 'Existing'
}

interface DomainStatusProps {
  onChange: (value: DomainStatusType) => void
  disabled: boolean
  step?: number // TODO: Remove this
}

function DomainStatus({ onChange, disabled, step }: DomainStatusProps) {
  const wizard = useWizardForm()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value as DomainStatusType)
    wizard.next()
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>What would you like to do?</QuestionTitle>
      <QuestionForm>
        <RadioGroup aria-label="Domain Status" onChange={handleChange}>
          <FormControlLabel
            value={DomainStatusType.New}
            control={<Radio />}
            label="I’d like to buy a new domain"
            disabled={disabled}
          />
          <FormControlLabel
            value={DomainStatusType.Existing}
            control={<Radio />}
            label="I have an existing domain I’d like to use"
            disabled={disabled}
          />
        </RadioGroup>
      </QuestionForm>
    </QuestionSection>
  )
}

export default DomainStatus
