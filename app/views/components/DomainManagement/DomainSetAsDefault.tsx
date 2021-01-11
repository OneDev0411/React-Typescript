import React, { ChangeEvent } from 'react'

import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'
import { IContextState } from 'components/QuestionWizard/context'
import { useWizardForm } from 'components/QuestionWizard/use-context'

export enum DomainSetAsDefaultType {
  Yes = 'Yes',
  No = 'No'
}

interface DomainSetAsDefaultProps {
  onChange: (value: DomainSetAsDefaultType, wizard: IContextState) => void
  disabled: boolean
  step?: number // TODO: Remove this
}

function DomainSetAsDefault({
  onChange,
  step,
  disabled
}: DomainSetAsDefaultProps) {
  const wizard = useWizardForm()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value as DomainSetAsDefaultType, wizard)
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>
        Do you want to set this domain as the default domain?
      </QuestionTitle>
      <QuestionForm>
        <RadioGroup aria-label="Set Domain As Default" onChange={handleChange}>
          <FormControlLabel
            value={DomainSetAsDefaultType.Yes}
            control={<Radio />}
            label="Yes, use this domain as my default domain"
            disabled={disabled}
          />
          <FormControlLabel
            value={DomainSetAsDefaultType.No}
            control={<Radio />}
            label="No, I don't want to use this as my default domain"
            disabled={disabled}
          />
        </RadioGroup>
      </QuestionForm>
    </QuestionSection>
  )
}

export default DomainSetAsDefault
