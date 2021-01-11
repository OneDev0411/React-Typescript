import React, { ChangeEvent, useState } from 'react'

import { Box, Button, TextField } from '@material-ui/core'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'
import { useWizardForm } from 'components/QuestionWizard/use-context'

interface DomainNameProps {
  onChange: (value: string) => void
  disabled: boolean
  step?: number // TODO: Remove this
}

function DomainName({ onChange, disabled, step }: DomainNameProps) {
  const [domainName, setDomainName] = useState('')
  const wizard = useWizardForm()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDomainName(event.target.value)
  }

  const handleClick = () => {
    onChange(domainName)
    wizard.next()
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>Please enter the domain name</QuestionTitle>
      <QuestionForm>
        <Box>
          <TextField
            aria-label="Domain Name"
            label="Domain Name"
            onChange={handleChange}
            fullWidth
            placeholder="yourdomain.com"
            type="text"
            disabled={disabled}
            size="medium"
          />
          <Box marginTop={3}>
            <Button
              variant="contained"
              color="secondary"
              disabled={!domainName.length || disabled}
              onClick={handleClick}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </QuestionForm>
    </QuestionSection>
  )
}

export default DomainName
