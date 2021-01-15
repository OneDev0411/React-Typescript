import React, { ChangeEvent, FormEvent, useState } from 'react'

import { Box, Button, TextField } from '@material-ui/core'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'
import { useWizardForm } from 'components/QuestionWizard/use-context'
import { IContextState } from 'components/QuestionWizard/context'

interface DomainNameProps {
  onChange: (value: string, wizard: IContextState) => void
  disabled: boolean
  step?: number // TODO: Remove this
}

function DomainName({ onChange, disabled, step }: DomainNameProps) {
  const [domainName, setDomainName] = useState('')
  const wizard = useWizardForm()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDomainName(event.target.value)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onChange(domainName, wizard)
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>Please enter the domain name</QuestionTitle>
      <QuestionForm>
        <form onSubmit={handleSubmit}>
          <TextField
            aria-label="Domain Name"
            label="Domain Name"
            onChange={handleChange}
            fullWidth
            placeholder="yourdomain.com"
            type="text"
            disabled={disabled}
            size="medium"
            autoFocus
          />
          <Box marginTop={3}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={!domainName.length || disabled}
            >
              Continue
            </Button>
          </Box>
        </form>
      </QuestionForm>
    </QuestionSection>
  )
}

export default DomainName
