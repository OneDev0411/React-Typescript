import React, { ChangeEvent, useEffect, useState } from 'react'
import { Box, Checkbox, FormControlLabel, makeStyles } from '@material-ui/core'

import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import { QuestionForm, QuestionTitle } from 'components/QuestionWizard'
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
}

const defaultAgreementList: IDomainAgreement[] = []

function DomainAgreement({
  domainName,
  onNextClick,
  disabled
}: DomainAgreementProps) {
  const classes = useStyles()
  const wizard = useWizardContext()
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
    <>
      <QuestionTitle>
        Read and accept the domain registration agreement from GoDaddy
      </QuestionTitle>
      <QuestionForm width="85%">
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
    </>
  )
}

export default DomainAgreement
