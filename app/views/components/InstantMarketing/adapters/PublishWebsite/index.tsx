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
  selectedTemplate: IMarketingTemplate
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

  const openDomainManagement = () => setIsDomainManagementOpen(true)

  const closeDomainManagement = () => setIsDomainManagementOpen(false)

  const {
    publishWebsite,
    isPublishing,
    publishButtonLabel
  } = usePublishWebsite(result => {
    setWebsiteData(result.website)

    if (!websiteData) {
      openDomainManagement()
    }
  })

  const handleCloseBuilder = () => {
    setIsBuilderOpen(false)
    onFinish()
  }

  const handleSaveBuilder = (template: IBrandMarketingTemplateWithResult) => {
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

  return (
    <>
      {(isAgentTriggered || isBuilderOpen) && (
        <InstantMarketing
          templateData={{ listing: selectedListing[0] }}
          onClose={handleCloseBuilder}
          handleSave={handleSaveBuilder}
          bareMode
          hideTemplatesColumn
          saveButtonText={publishButtonLabel}
          actionButtonsDisabled={isPublishing}
          customActions={
            !!websiteData && (
              <Button
                type="button"
                variant="outlined"
                disabled={isPublishing}
                onClick={openDomainManagement}
              >
                Manage Domains
              </Button>
            )
          }
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
          onClose={closeDomainManagement}
          websiteId={websiteData.id}
          websiteHostnames={websiteData.hostnames}
        />
      )}
    </>
  )
}

export default PublishWebsite
