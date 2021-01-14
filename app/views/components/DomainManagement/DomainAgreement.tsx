import React, { useEffect } from 'react'
import { Box, Button } from '@material-ui/core'

import { useWizardForm } from 'components/QuestionWizard/use-context'
import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'
import useAsync from 'hooks/use-async'
import getDomainAgreements from 'models/domains/get-domain-agreements'

interface DomainAgreementProps {
  domainName: string
  onNextClick: (agreementKeys: string[]) => void
  step?: number // TODO: Remove this
}

const defaultAgreementList: IDomainAgreement[] = []

function DomainAgreement({
  step,
  domainName,
  onNextClick
}: DomainAgreementProps) {
  const wizard = useWizardForm()
  const { run, data: agreements, isLoading } = useAsync({
    data: defaultAgreementList
  })

  useEffect(() => {
    run(async () => getDomainAgreements(domainName))
  }, [run, domainName])

  const handleNext = () => {
    if (!agreements.length) {
      return
    }

    onNextClick(agreements.map(agreement => agreement.agreementKey))
    wizard.next()
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>Domain Registration Agreement</QuestionTitle>
      <QuestionForm>
        <Box>
          {isLoading ? (
            'loading...'
          ) : (
            <>
              {agreements.map(agreement => (
                <div
                  key={agreement.agreementKey}
                  dangerouslySetInnerHTML={{ __html: agreement.content }}
                />
              ))}
            </>
          )}
        </Box>
        <Box marginTop={3}>
          <Button onClick={handleNext} variant="contained" color="secondary">
            Next
          </Button>
        </Box>
      </QuestionForm>
    </QuestionSection>
  )
}

export default DomainAgreement
