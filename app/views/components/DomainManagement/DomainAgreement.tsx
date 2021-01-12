import React from 'react'
import { Button } from '@material-ui/core'

import { useWizardForm } from 'components/QuestionWizard/use-context'
import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'

interface DomainAgreementProps {
  step?: number // TODO: Remove this
}

function DomainAgreement({ step }: DomainAgreementProps) {
  const wizard = useWizardForm()

  const handleNext = () => {
    wizard.next()
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>View Domain Registration Agreement</QuestionTitle>
      <QuestionForm>
        <div>
          domain DomainAgreement
          <br />
          <Button onClick={handleNext} variant="contained" color="secondary">
            Next
          </Button>
        </div>
      </QuestionForm>
    </QuestionSection>
  )
}

export default DomainAgreement
