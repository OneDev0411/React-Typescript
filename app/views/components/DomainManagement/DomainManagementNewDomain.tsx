import React, { useState } from 'react'

import { useDispatch } from 'react-redux'

import { Box, Button, useTheme } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'

import { addNotification as notify } from 'components/notification'

import useAsync from 'hooks/use-async'
import { QuestionWizard } from 'components/QuestionWizard'

import { IContextState } from 'components/QuestionWizard/context'

import addHostnameToWebsite from 'models/website/add-hostname-to-website'

import DomainStatus, { DomainStatusType } from './DomainStatus'
import DomainName from './DomainName'
import DomainSetAsDefault, {
  DomainSetAsDefaultType
} from './DomainSetAsDefault'
import DomainSearch from './DomainSearch'
import DomainAgreement from './DomainAgreement'

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

  const [domainStatus, setDomainStatus] = useState<DomainStatusType>(
    DomainStatusType.Existing
  )
  const [domainName, setDomainName] = useState('')

  const handleDomainStatusChange = (domainStatus: DomainStatusType) => {
    setDomainStatus(domainStatus)
    setDomainName('')
  }

  const handleAddDomain = (domainName: string, isDefault: boolean) => {
    onDomainAdd(domainName, isDefault)
    onBack()
  }

  const handleAddExistingDomain = (
    isDefault: string,
    wizard: IContextState
  ) => {
    const isDefaultValue = isDefault === DomainSetAsDefaultType.Yes

    wizard.next((resolve, reject) => {
      run(async () =>
        addHostnameToWebsite(websiteId, {
          hostname: domainName,
          is_default: isDefaultValue
        })
      ).then(
        () => {
          handleAddDomain(domainName, isDefaultValue)
          dispatch(
            notify({
              message: 'The domain added successfully',
              status: 'success'
            })
          )
        },
        () => {
          reject()
          dispatch(
            notify({
              message:
                'An error occurred on adding the domain, please try again',
              status: 'error'
            })
          )
        }
      )
    })
  }

  const isNew = domainStatus === DomainStatusType.New

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
        <QuestionWizard defaultStep={0}>
          <DomainStatus
            onChange={handleDomainStatusChange}
            disabled={isWorking}
          />
          {isNew ? (
            <DomainSearch
              domainName={domainName}
              onDomainNameChange={setDomainName}
              disabled={isWorking}
            />
          ) : (
            <DomainName onChange={setDomainName} disabled={isWorking} />
          )}
          {isNew && <DomainAgreement />}
          {domainName && (
            <DomainSetAsDefault
              onChange={handleAddExistingDomain}
              disabled={isWorking}
            />
          )}
        </QuestionWizard>
      </Box>
    </div>
  )
}

export default DomainManagementNewDomain
