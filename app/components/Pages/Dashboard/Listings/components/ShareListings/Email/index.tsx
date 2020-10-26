import React, { useState } from 'react'

import { Button, Tooltip } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

import getListing from 'models/listings/listing/get-listing'
import MarketingTemplatePickerModal from 'components/MarketingTemplatePickerModal'
import ListingFlow from 'components/InstantMarketing/adapters/SendMlsListingCard'
import { useListSelection } from 'components/ListSelection/use-list-selection'

export function EmailAction() {
  const { selections } = useListSelection()

  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false)
  const [listings, setListings] = useState<IListing[]>([])
  const [template, setTemplate] = useState<Nullable<IBrandMarketingTemplate>>(
    null
  )

  const user = useSelector<IAppState, IUser>(({ user }) => user)

  const handleSelectTemplate = async (template: IBrandMarketingTemplate) => {
    const listings = await Promise.all(
      selections.map(async (selection: IListing) => {
        return getListing(selection.id)
      })
    )

    setIsTemplatesModalOpen(false)
    setListings(listings)
    setTemplate(template)
  }

  const handleClose = () => {
    setTemplate(null)
    setListings([])
  }

  return (
    <>
      <Tooltip title="Send as Email">
        <Button
          size="small"
          variant="outlined"
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

      {template && listings.length > 0 && (
        <ListingFlow
          isTemplatesColumnHiddenDefault={false}
          handleTrigger={handleClose}
          isTriggered
          isMultiListing={listings.length > 1}
          hasExternalTrigger
          listings={listings}
        />
      )}
    </>
  )
}
