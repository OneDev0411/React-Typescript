import React, { useState } from 'react'

import { Button, CircularProgress, Tooltip } from '@material-ui/core'

import { useSelector } from 'react-redux'

import SearchListingDrawer from 'components/SearchListingDrawer'
import InstantMarketing, {
  IBrandMarketingTemplateWithResult
} from 'components/InstantMarketing'

import DomainManagementDrawer from 'components/DomainManagementDrawer'

import usePublishWebsite from 'hooks/use-publish-website'

import { selectUser } from 'selectors/user'

import useListingsEditorAssets from 'hooks/use-listings-editor-assets'

import useLoadListingsData from './use-load-listings-data'

interface PublishWebsiteProps {
  isEdit: boolean
  isTriggered: boolean
  templateType: IWebsiteTemplateType
  selectedTemplate: IBrandMarketingTemplate
  onFinish: () => {}
}

function PublishWebsite({
  isTriggered,
  isEdit,
  templateType,
  onFinish,
  selectedTemplate
}: PublishWebsiteProps) {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [isDomainManagementOpen, setIsDomainManagementOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<IListing[]>([])
  const [websiteData, setWebsiteData] = useState<IWebsite | null>(null)
  const user = useSelector(selectUser)

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
    openDomainManagement()
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

  const handleDomainAdd = (domainName: string, isDefault: boolean) => {
    setWebsiteData(oldWebsiteData => {
      if (!oldWebsiteData) {
        return null
      }

      const websiteHostnames = oldWebsiteData.hostnames ?? []

      return {
        ...oldWebsiteData,
        hostnames: isDefault
          ? [domainName, ...websiteHostnames]
          : [...websiteHostnames, domainName]
      }
    })
  }

  const handleDomainDelete = (domainName: string) => {
    setWebsiteData(oldWebsiteData =>
      oldWebsiteData
        ? {
            ...oldWebsiteData,
            hostnames:
              oldWebsiteData.hostnames?.filter(
                hostname => hostname !== domainName
              ) || []
          }
        : null
    )
  }

  const handleListingDrawerClose = () => onFinish()

  const handleSelectListings = listings => {
    setSelectedListing(listings)
    setIsBuilderOpen(true)
  }

  const assets = useListingsEditorAssets(selectedListing)

  return (
    <>
      {(isAgentTriggered || isBuilderOpen) && (
        <InstantMarketing
          defaultTemplate={selectedTemplate}
          templateData={{ listing: selectedListing[0], user }}
          onClose={handleCloseBuilder}
          handleSave={handleSaveBuilder}
          bareMode
          hideTemplatesColumn
          saveButtonText={publishButtonLabel}
          saveButtonStartIcon={
            isPublishing && <CircularProgress color="inherit" size={20} />
          }
          assets={assets}
          actionButtonsDisabled={isPublishing}
          customActions={
            <Button
              type="button"
              variant="outlined"
              disabled={isPublishing || !websiteData}
              onClick={openDomainManagement}
            >
              Manage Domains
            </Button>
          }
          saveButtonWrapper={saveButton => (
            <Tooltip
              open={isPublishing}
              title="This might take a minute or two"
            >
              <span>{saveButton}</span>
            </Tooltip>
          )}
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
            title: 'Add from your deals',
            items: dealsList
          },
          {
            title: 'Add from your MLS listings',
            items: brandListings
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
          onDomainAdd={handleDomainAdd}
          onDomainDelete={handleDomainDelete}
        />
      )}
    </>
  )
}

export default PublishWebsite
