import React, { ChangeEvent } from 'react'

import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'
import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'

export enum DomainStatusType {
  New = 'New',
  Existing = 'Existing'
}

interface DomainStatusProps {
  onChange: (value: DomainStatusType) => void
  disabled: boolean
}

function DomainStatus({ onChange, disabled }: DomainStatusProps) {
  const wizard = useWizardContext()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value as DomainStatusType)
    wizard.next()
  }

  return (
    <QuestionSection>
      <QuestionTitle>What would you like to do?</QuestionTitle>
      <QuestionForm width="85%">
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
