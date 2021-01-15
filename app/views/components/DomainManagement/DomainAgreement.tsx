import React, { useEffect } from 'react'
import { Box, Button, makeStyles } from '@material-ui/core'

import { useWizardForm } from 'components/QuestionWizard/use-context'
import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'
import useAsync from 'hooks/use-async'
import getDomainAgreements from 'models/domains/get-domain-agreements'

const useStyles = makeStyles(
  theme => ({
    agreement: {
      maxHeight: 10 * 19,
      overflowX: 'hidden',
      overflowY: 'auto',
      marginBottom: theme.spacing(2),
      backgroundColor: 'rgba(0, 0, 0, 0.09)',
      padding: '12px 10px',
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius
    }
  }),
  { name: 'DomainAgreement' }
)

interface DomainAgreementProps {
  domainName: string
  onNextClick: (agreementKeys: string[]) => void
  disabled: boolean
  step?: number // TODO: Remove this
}

const defaultAgreementList: IDomainAgreement[] = []

function DomainAgreement({
  step,
  domainName,
  onNextClick,
  disabled
}: DomainAgreementProps) {
  const classes = useStyles()
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
        {isLoading ? (
          'loading...'
        ) : (
          <>
            <Box>
              {agreements.map(agreement => (
                <div
                  key={agreement.agreementKey}
                  className={classes.agreement}
                  dangerouslySetInnerHTML={{ __html: agreement.content }}
                />
              ))}
            </Box>
            <Box marginTop={3}>
              <Button
                onClick={handleNext}
                variant="contained"
                color="secondary"
                disabled={disabled}
              >
                Next
              </Button>
            </Box>
          </>
        )}
      </QuestionForm>
    </QuestionSection>
  )
}

export default DomainAgreement
