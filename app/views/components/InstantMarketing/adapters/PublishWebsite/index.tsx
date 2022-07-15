import { useState } from 'react'

import { Button, CircularProgress, Tooltip } from '@material-ui/core'
import { useSelector } from 'react-redux'

import useListingsEditorAssets from '@app/hooks/use-listings-editor-assets'
import useListingsEditorTemplateData from '@app/hooks/use-listings-editor-template-data'
import DomainManagementDrawer from 'components/DomainManagementDrawer'
import InstantMarketing, {
  IBrandMarketingTemplateWithResult
} from 'components/InstantMarketing'
import { getHipPocketTemplateImagesUploader } from 'components/InstantMarketing/helpers/get-hip-pocket-template-image-uploader'
import SearchListingDrawer from 'components/SearchListingDrawer'
import usePublishWebsite from 'hooks/use-publish-website'
import { selectUser } from 'selectors/user'

import getTemplateObject from '../../helpers/get-template-object'

import useLoadListingsData from './use-load-listings-data'

interface PublishWebsiteProps {
  isEdit: boolean
  isTriggered: boolean
  templateType: IMarketingTemplateType
  selectedTemplate: Nullable<IBrandMarketingTemplate>
  onFinish: () => {}
}

function PublishWebsite({
  isTriggered,
  isEdit,
  templateType,
  onFinish,
  selectedTemplate
}: PublishWebsiteProps) {
  const [isDomainManagementOpen, setIsDomainManagementOpen] = useState(false)
  const [selectedListings, setSelectedListings] = useState<
    WithMock<IListing>[]
  >([])
  const [websiteData, setWebsiteData] = useState<IWebsite | null>(null)
  const user = useSelector(selectUser)

  /**
   * TODO: We have to refactor this flow to support all template types in website builder.
   *
   * I know this is not ideal that this flow only supports having SearchListingDrawer
   * and it can not provides the required data for all template types. We need to refactor
   * the logic and remove this flow and move the publish logic to all other flows.
   * This way, the website builder could work with all template types.
   *
   * I didn't refactor that because we are planning to refactor the builder to use
   * `template.variables` instead of having these flows.
   */
  const isListing = ['Listing', 'Listings'].includes(templateType)
  const isListingTriggered = !isEdit && isTriggered && isListing

  const isBuilderOpen =
    (isTriggered && !isListing) || (isListing && selectedListings.length > 0)

  const [brandListings, dealsList] = useLoadListingsData(!isEdit)

  const openDomainManagement = () => setIsDomainManagementOpen(true)

  const closeDomainManagement = () => setIsDomainManagementOpen(false)

  const { publishWebsite, isPublishing, publishButtonLabel } =
    usePublishWebsite(result => {
      setWebsiteData(result.website)
      openDomainManagement()
    })

  const handleCloseBuilder = () => {
    setSelectedListings([])
    onFinish()
  }

  const handleSaveBuilder = (template: IBrandMarketingTemplateWithResult) => {
    publishWebsite(
      websiteData?.id,
      template,
      {
        listings: selectedListings
          ?.filter(listing => !listing?.isMock) // We should never send our mock listing id to API
          .map(listing => listing.id),
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
    setSelectedListings(listings)
  }

  const isMultiListing =
    !!selectedTemplate &&
    getTemplateObject(selectedTemplate).template_type === 'Listings'

  const assets = useListingsEditorAssets(selectedListings)

  const templateData = useListingsEditorTemplateData(
    selectedListings,
    isMultiListing
  )

  return (
    <>
      {isBuilderOpen && (
        <InstantMarketing
          defaultTemplate={selectedTemplate}
          templateData={{ ...templateData, user }}
          onClose={handleCloseBuilder}
          handleSave={handleSaveBuilder}
          shouldSkipVideoGif
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
      {isListingTriggered && !isBuilderOpen && selectedTemplate && (
        <SearchListingDrawer
          allowHipPocket
          onHipPocketImageUpload={getHipPocketTemplateImagesUploader(
            selectedTemplate.template.id
          )}
          withMlsDisclaimer
          isOpen
          title={isMultiListing ? 'Select Listings' : 'Select a Listing'}
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
          multipleSelection={isMultiListing}
          renderAction={props => (
            <Button
              variant="contained"
              color="secondary"
              {...props.buttonProps}
            >
              {`Next (${props.selectedItemsCount} Listings Selected)`}
            </Button>
          )}
        />
      )}
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
