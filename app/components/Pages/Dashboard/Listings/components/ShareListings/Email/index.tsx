import React, { useState } from 'react'

import { Button, Tooltip } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

import MarketingTemplatePickerModal from 'components/MarketingTemplatePickerModal'
import ListingFlow from 'components/InstantMarketing/adapters/SendMlsListingCard'
import { useListSelection } from 'components/ListSelection/use-list-selection'

export function EmailAction() {
  const { selections } = useListSelection()

  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false)
  const [template, setTemplate] = useState<Nullable<IBrandMarketingTemplate>>(
    null
  )

  const user = useSelector<IAppState, IUser>(({ user }) => user)

  const handleSelectTemplate = (template: IBrandMarketingTemplate) => {
    setIsTemplatesModalOpen(false)
    setTemplate(template)
  }

  const handleClose = () => {
    setTemplate(null)
  }

  return (
    <>
      <Tooltip title="Send as Email">
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() => setIsTemplatesModalOpen(true)}
        >
          Email
        </Button>
      </Tooltip>

      {isTemplatesModalOpen && (
        <MarketingTemplatePickerModal
          title="Select Template"
          user={user}
          mediums={['Email' as MarketingTemplateMedium.Email]}
          templateTypes={['Listings']}
          onSelect={handleSelectTemplate}
          onClose={() => setIsTemplatesModalOpen(false)}
        />
      )}

      {template && (
        <ListingFlow
          isTemplatesColumnHiddenDefault={false}
          handleTrigger={handleClose}
          isTriggered
          isMultiListing
          hasExternalTrigger
          listings={selections}
        />
      )}
    </>
  )
}
