import { useState, useContext } from 'react'

import {
  Button,
  CircularProgress,
  makeStyles,
  Tooltip
} from '@material-ui/core'
import pluralize from 'pluralize'
import { useSelector } from 'react-redux'

import useListingsEditorAssets from '@app/hooks/use-listings-editor-assets'
import useListingsEditorTemplateData from '@app/hooks/use-listings-editor-template-data'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import DomainManagementDrawer from 'components/DomainManagementDrawer'
import InstantMarketing, {
  IBrandMarketingTemplateWithResult
} from 'components/InstantMarketing'
import { getHipPocketTemplateImagesUploader } from 'components/InstantMarketing/helpers/get-hip-pocket-template-image-uploader'
import SearchListingDrawer from 'components/SearchListingDrawer'
import usePublishWebsite from 'hooks/use-publish-website'
import { selectUser } from 'selectors/user'

import {
  IListingWithAdjustment,
  ListingsAdjustmentModal
} from '../../components/ListingsAdjustmentModal'
import { MULTI_LISTINGS_TEMPLATE_TYPES_LIST } from '../../constants'
import getTemplateObject from '../../helpers/get-template-object'

import useLoadListingsData from './use-load-listings-data'

interface PublishWebsiteProps {
  isEdit: boolean
  isTriggered: boolean
  templateType: IMarketingTemplateType
  selectedTemplate: Nullable<IBrandMarketingTemplate>
  onFinish: () => {}
}

const useStyles = makeStyles(
  theme => ({
    editAdjustmentButton: {
      marginRight: theme.spacing(1)
    }
  }),
  {
    name: 'InstantMarketingPublishWebsite'
  }
)

function PublishWebsite({
  isTriggered,
  isEdit,
  templateType,
  onFinish,
  selectedTemplate
}: PublishWebsiteProps) {
  const classes = useStyles()
  const confirmation = useContext(ConfirmationModalContext)

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
  const isListing = ['Listing', 'Listings', 'CMA'].includes(templateType)
  const isListingTriggered = !isEdit && isTriggered && isListing

  const isBuilderOpen =
    (isTriggered && !isListing) || (isListing && selectedListings.length > 0)

  const [brandListings, dealsList] = useLoadListingsData(!isEdit)

  const openDomainManagement = () => setIsDomainManagementOpen(true)

  const closeDomainManagement = () => setIsDomainManagementOpen(false)

  const [adjustmentModalListings, setAdjustmentModalListings] =
    useState<Optional<IListing[]>>(undefined)

  const isAdjustmentModalOpen = !!adjustmentModalListings
  const handleCloseAdjustmentModal = () => setAdjustmentModalListings(undefined)

  const newWebsiteTitle = selectedListings?.length
    ? selectedListings[0].property.address.full_address
    : 'New Website Title'

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
            title: newWebsiteTitle,
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

  const handleOpenAdjustmentModal = (listings: IListingWithAdjustment[]) => {
    setAdjustmentModalListings(listings)
  }

  const handleSelectListings = (listings: IListingWithAdjustment[]) => {
    setSelectedListings(listings)
    handleCloseAdjustmentModal()
  }

  const isMultiListing =
    !!selectedTemplate &&
    MULTI_LISTINGS_TEMPLATE_TYPES_LIST.includes(
      getTemplateObject(selectedTemplate).template_type
    )

  const isCmaListing =
    !!selectedTemplate &&
    getTemplateObject(selectedTemplate).template_type === 'CMA'

  const assets = useListingsEditorAssets(selectedListings)

  const templateData = useListingsEditorTemplateData(
    selectedListings,
    isMultiListing
  )

  const onEditAdjustment = () => {
    confirmation.setConfirmationModal({
      message: 'Are you sure you want to edit?',
      description:
        'After editing the adjustments, all edits on the website will be lost.      ',
      cancelLabel: 'Cancel',
      confirmLabel: 'Yes, Edit',
      onConfirm: () => {
        handleOpenAdjustmentModal(selectedListings)
        setSelectedListings([])
      }
    })
  }

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
            <>
              {isCmaListing && (
                <Tooltip title="After editing the adjustments, all edits on the website will be lost.">
                  <Button
                    type="button"
                    variant="outlined"
                    disabled={isPublishing}
                    onClick={onEditAdjustment}
                    className={classes.editAdjustmentButton}
                  >
                    Edit Adjustments
                  </Button>
                </Tooltip>
              )}
              <Button
                type="button"
                variant="outlined"
                disabled={isPublishing || !websiteData}
                onClick={openDomainManagement}
              >
                Manage Domains
              </Button>
            </>
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
          onSelectListingsCallback={
            isCmaListing ? handleOpenAdjustmentModal : handleSelectListings
          }
          multipleSelection={isMultiListing}
          renderAction={props => (
            <Button
              variant="contained"
              color="secondary"
              {...props.buttonProps}
            >
              Next
              {isMultiListing &&
                ` (${props.selectedItemsCount} ${pluralize(
                  'Listing',
                  props.selectedItemsCount
                )} Selected)`}
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
      {isAdjustmentModalOpen && (
        <ListingsAdjustmentModal
          onClose={handleCloseAdjustmentModal}
          listings={adjustmentModalListings}
          onSave={handleSelectListings}
        />
      )}
    </>
  )
}

export default PublishWebsite
