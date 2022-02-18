import { useState } from 'react'

import { Box, Button, useTheme } from '@material-ui/core'
import { mdiArrowLeft } from '@mdi/js'
import { useDispatch } from 'react-redux'

import { addNotification as notify } from 'components/notification'
import { QuestionSection, QuestionWizard } from 'components/QuestionWizard'
import { IWizardState } from 'components/QuestionWizard/context'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
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

    run(async () => {
      try {
        await addHostnameToWebsite(websiteId, {
          hostname: domainName,
          is_default: true
        })
        handleAddDomain(domainName, true)
        dispatch(
          notify({
            message: 'The domain added successfully',
            status: 'success'
          })
        )
      } catch (_: unknown) {
        dispatch(
          notify({
            message: 'An error occurred on adding the domain, please try again',
            status: 'error'
          })
        )
        wizard.setLoading(false)
      }
    })
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
    run(async () => {
      try {
        await purchaseDomain(stripeCustomerId, domainName, domainAgreementKeys)
        handleAddDomainToHost(domainName, wizard)
      } catch (_: unknown) {
        dispatch(
          notify({
            message:
              'Something went wrong while purchasing the domain. Please try again.',
            status: 'error'
          })
        )
      }

      wizard.setLoading(false)
      done?.()
    })
  }

  return (
    <div className={className}>
      <Box marginBottom={3} color={theme.palette.grey[600]}>
        <Button
          type="button"
          onClick={onBack}
          disabled={isWorking}
          startIcon={<SvgIcon path={mdiArrowLeft} />}
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
