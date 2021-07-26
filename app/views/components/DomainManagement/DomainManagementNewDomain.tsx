import React, { useState } from 'react'

import { Box, Button, useTheme } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'
import { useDispatch } from 'react-redux'

import { addNotification as notify } from 'components/notification'
import { QuestionSection, QuestionWizard } from 'components/QuestionWizard'
import { IWizardState } from 'components/QuestionWizard/context'
import useAsync from 'hooks/use-async'
import purchaseDomain from 'models/domains/purchase-domain'
import addHostnameToWebsite from 'models/website/add-hostname-to-website'

import DomainAgreement from './DomainAgreement'
import DomainName from './DomainName'
import DomainPayment from './DomainPayment'
import DomainSearch from './DomainSearch'
import { DomainStatusType } from './DomainStatus'

export interface DomainManagementNewDomainProps {
  className: string
  onBack: () => void
  websiteId: IWebsite['id']
  onDomainAdd: (domainName: string, isDefault: boolean) => void
}

function DomainManagementNewDomain({
  className,
  onBack,
  websiteId,
  onDomainAdd
}: DomainManagementNewDomainProps) {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { isLoading: isWorking, run } = useAsync()

  const [domainStatus] = useState<DomainStatusType>(DomainStatusType.New)
  const [domainName, setDomainName] = useState('')
  const [domainPrice, setDomainPrice] = useState('')

  const [domainAgreementKeys, setDomainAgreementKeys] = useState<string[]>([])

  // const handleDomainStatusChange = (domainStatus: DomainStatusType) => {
  //   setDomainStatus(domainStatus)
  //   setDomainName('')
  // }

  const handleAddDomain = (domainName: string, isDefault: boolean) => {
    onDomainAdd(domainName, isDefault)
    onBack()
  }

  const handleAddDomainToHost = (domainName: string, wizard: IWizardState) => {
    wizard.setLoading(true)

    run(async () =>
      addHostnameToWebsite(websiteId, {
        hostname: domainName,
        is_default: true
      })
    ).then(
      () => {
        handleAddDomain(domainName, true)
        dispatch(
          notify({
            message: 'The domain added successfully',
            status: 'success'
          })
        )
      },
      () => {
        dispatch(
          notify({
            message: 'An error occurred on adding the domain, please try again',
            status: 'error'
          })
        )
        wizard.setLoading(false)
      }
    )
  }

  const handleSelectDomainName = (domainName: string, price: string) => {
    setDomainAgreementKeys([])
    setDomainName(domainName)
    setDomainPrice(price)
  }

  const isNew = domainStatus === DomainStatusType.New

  const handlePurchase = (
    stripeCustomerId: string,
    wizard: IWizardState,
    done?: () => void
  ) => {
    wizard.setLoading(true)
    run(async () =>
      purchaseDomain(stripeCustomerId, domainName, domainAgreementKeys)
    )
      .then(
        () => handleAddDomainToHost(domainName, wizard),
        () => wizard.setLoading(false)
      )
      .finally(() => done?.())
  }

  return (
    <div className={className}>
      <Box marginBottom={3} color={theme.palette.grey[600]}>
        <Button
          type="button"
          onClick={onBack}
          disabled={isWorking}
          startIcon={<ArrowBack />}
          color="inherit"
        >
          Back to domain list
        </Button>
      </Box>
      <Box marginLeft={2}>
        <QuestionWizard>
          {/* <DomainStatus
            onChange={handleDomainStatusChange}
            disabled={isWorking}
          /> */}
          {isNew ? (
            <DomainSearch
              domainName={domainName}
              onSelectDomainName={handleSelectDomainName}
              disabled={isWorking}
            />
          ) : (
            <DomainName onChange={handleAddDomainToHost} disabled={isWorking} />
          )}
          <QuestionSection hidden={!(isNew && !!domainName)}>
            <DomainAgreement
              domainName={domainName}
              onNextClick={setDomainAgreementKeys}
              disabled={isWorking}
            />
          </QuestionSection>
          <QuestionSection
            hidden={!(isNew && !!domainName && !!domainAgreementKeys.length)}
          >
            <DomainPayment
              domainPrice={domainPrice}
              onPayClick={handlePurchase}
              disabled={isWorking}
            />
          </QuestionSection>
        </QuestionWizard>
      </Box>
    </div>
  )
}

export default DomainManagementNewDomain
