import React, { useState } from 'react'

import { Button } from '@material-ui/core'

import SearchListingDrawer from 'components/SearchListingDrawer'
import InstantMarketing from 'components/InstantMarketing'

import useLoadListingsData from './use-load-listings-data'

interface PublishWebsiteProps {
  isEdit: boolean
  isTriggered: boolean
  templateType: IWebsiteTemplateType
  selectedTemplate: IWebsiteTemplate
  onFinish: () => {}
}

function PublishWebsite({
  isTriggered,
  isEdit,
  templateType,
  onFinish
}: PublishWebsiteProps) {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState([])

  const isAgentTriggered = isTriggered && templateType === 'Agent'
  const isListingTriggered =
    !isEdit && isTriggered && templateType === 'Listing'

  const [brandListings, dealsList] = useLoadListingsData(
    !isEdit && templateType === 'Listing'
  )

  const handleCloseBuilder = () => {
    setIsBuilderOpen(false)
    onFinish()
  }

  const handleSaveBuilder = () => {
    alert('this feature is not implemented yet')
  }

  const handleListingDrawerClose = () => onFinish()

  const handleSelectListings = listings => {
    setSelectedListing(listings)
    setIsBuilderOpen(true)
  }

  console.log('selectedListing', selectedListing)

  return (
    <>
      {(isAgentTriggered || isBuilderOpen) && (
        <InstantMarketing
          onClose={handleCloseBuilder}
          handleSave={handleSaveBuilder}
          bareMode
          hideTemplatesColumn
        />
      )}
      <SearchListingDrawer
        mockListings
        allowSkip
        isOpen={isListingTriggered && !isBuilderOpen}
        title="Select a Listing"
        searchPlaceholder="Enter MLS# or an address"
        defaultLists={[
          {
            title: 'Add from your MLS listings',
            items: brandListings
          },
          {
            title: 'Add from your deals',
            items: dealsList
          }
        ]}
        onClose={handleListingDrawerClose}
        onSelectListingsCallback={handleSelectListings}
        renderAction={props => (
          <Button {...props.buttonProps}>
            {`Next (${props.selectedItemsCount} Listings Selected)`}
          </Button>
        )}
      />
    </>
  )
}

export default PublishWebsite
