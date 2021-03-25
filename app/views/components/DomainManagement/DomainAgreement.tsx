import React, { ChangeEvent, useEffect, useState } from 'react'
import { Box, Checkbox, FormControlLabel, makeStyles } from '@material-ui/core'

import { useWizardForm } from 'components/QuestionWizard/use-context'
import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'
import useAsync from 'hooks/use-async'
import getDomainAgreements from 'models/domains/get-domain-agreements'

import DomainLoading from './DomainLoading'

const useStyles = makeStyles(
  theme => ({
    agreement: {
      maxHeight: theme.spacing(30),
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
  const [checked, setChecked] = useState(false)
  const { run, data: agreements, isLoading } = useAsync({
    data: defaultAgreementList
  })

  useEffect(() => {
    setChecked(false)
    run(async () => getDomainAgreements(domainName))
  }, [run, domainName])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!agreements.length || !event.currentTarget.checked) {
      return
    }

    setChecked(true)
    onNextClick(agreements.map(agreement => agreement.agreementKey))
    wizard.next()
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>
        Read and accept the domain registration agreement from GoDaddy
      </QuestionTitle>
      <QuestionForm>
        {isLoading ? (
          <DomainLoading />
        ) : (
          <>
            {agreements.map(agreement => (
              <div
                key={agreement.agreementKey}
                className={classes.agreement}
                dangerouslySetInnerHTML={{ __html: agreement.content }}
              />
            ))}
            <Box marginTop={3}>
              <FormControlLabel
                control={<Checkbox />}
                label="I agree"
                disabled={disabled}
                onChange={handleChange}
                checked={checked}
              />
            </Box>
          </>
        )}
      </QuestionForm>
    </QuestionSection>
  )
}

export default DomainAgreement
