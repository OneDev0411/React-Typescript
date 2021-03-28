import React, { ChangeEvent, FormEvent, useState } from 'react'

import { Box, Button, TextField } from '@material-ui/core'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'
import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import { IWizardState } from 'components/QuestionWizard/context'

interface DomainNameProps {
  onChange: (value: string, wizard: IWizardState) => void
  disabled: boolean
}

function DomainName({ onChange, disabled }: DomainNameProps) {
  const [domainName, setDomainName] = useState('')
  const wizard = useWizardContext()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDomainName(event.target.value)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onChange(domainName, wizard)
  }

  return (
    <QuestionSection>
      <QuestionTitle>Please enter the domain name</QuestionTitle>
      <QuestionForm width="85%">
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
