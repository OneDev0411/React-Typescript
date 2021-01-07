import React, { useState } from 'react'

import { Button } from '@material-ui/core'

import SearchListingDrawer from 'components/SearchListingDrawer'
import InstantMarketing, {
  IBrandMarketingTemplateWithResult
} from 'components/InstantMarketing'

import DomainManagementDrawer from 'components/DomainManagementDrawer'

import usePublishWebsite from 'hooks/use-publish-website'

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
  const [isDomainManagementOpen, setIsDomainManagementOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<IListing[]>([])
  const [websiteData, setWebsiteData] = useState<IWebsite | null>(null)

  const isAgentTriggered = isTriggered && templateType === 'Agent'
  const isListingTriggered =
    !isEdit && isTriggered && templateType === 'Listing'

  const [brandListings, dealsList] = useLoadListingsData(
    !isEdit && templateType === 'Listing'
  )

  const { publishWebsite, isPublishing } = usePublishWebsite(result => {
    setWebsiteData(result.website)

    if (!websiteData) {
      setIsDomainManagementOpen(true)
    }
  })

  const handleCloseBuilder = () => {
    setIsBuilderOpen(false)
    onFinish()
  }

  const handleSaveBuilder = async (
    template: IBrandMarketingTemplateWithResult
  ) => {
    publishWebsite(
      websiteData?.id,
      template,
      {
        ...(selectedListing?.length
          ? { listings: selectedListing.map(listing => listing.id) }
          : {}),
        html: template.result
      },
      websiteData
        ? {
            title: websiteData.title,
            attributes: websiteData.attributes,
            template: websiteData.template
          }
        : {
            title: 'New Website Title',
            attributes: {},
            template: 'light'
          }
    )
  }

  const handleListingDrawerClose = () => onFinish()

  const handleSelectListings = listings => {
    setSelectedListing(listings)
    setIsBuilderOpen(true)
  }

  const handleCloseDomainManagement = () => setIsDomainManagementOpen(false)

  return (
    <>
      {(isAgentTriggered || isBuilderOpen) && (
        <InstantMarketing
          templateData={{ listing: selectedListing[0] }}
          onClose={handleCloseBuilder}
          handleSave={handleSaveBuilder}
          bareMode
          hideTemplatesColumn
          saveButtonText={isPublishing ? 'Publishing...' : 'Publish'}
          actionButtonsDisabled={isPublishing}
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
      {websiteData && (
        <DomainManagementDrawer
          open={isDomainManagementOpen}
          onClose={handleCloseDomainManagement}
          websiteId={websiteData.id}
          websiteTitle={websiteData.title}
          websiteHostnames={websiteData.hostnames}
        />
      )}
    </>
  )
}

export default PublishWebsite
