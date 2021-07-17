import { useState, useEffect, useCallback } from 'react'

import { Grid, Box, Divider, Typography, useTheme } from '@material-ui/core'
import { mdiAccountGroupOutline, mdiWeb } from '@mdi/js'
import { useSelector } from 'react-redux'

import { getArrayWithFallbackAccessor } from '@app/utils/get-array-with-fallback-accessor'
import { PLACEHOLDER_IMAGE_URL } from '@app/views/components/InstantMarketing/constants'
import SendMlsListingCard from 'components/InstantMarketing/adapters/SendMlsListingCard'
import LoadingContainer from 'components/LoadingContainer'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { meetingRoomOutlined } from 'components/SvgIcons/icons'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { useLoadingEntities } from 'hooks/use-loading'
import { useUniqueMediums } from 'hooks/use-unique-mediums'
import { useUniqueTemplateTypes } from 'hooks/use-unique-template-types'
import getListing from 'models/listings/listing/get-listing'
import { selectUser } from 'selectors/user'
import { getTemplateMediumLabel } from 'utils/marketing-center/get-template-medium-label'
import {
  hasUserAccessToCrm,
  hasUserAccessToMarketingCenter,
  hasUserAccessToAgentNetwork,
  hasUserAccessToWebsites
} from 'utils/user-teams'
import { getActiveTeamId } from 'utils/user-teams'

import { useTemplates } from '../../../components/Pages/Dashboard/Marketing/hooks/use-templates'
import {
  ALL_MEDIUMS,
  LISTING_TEMPLATE_TYPES
} from '../../../components/Pages/Dashboard/Marketing/Wizard/constants'

import MarketingButton from './MarketingButton'
import TemplatesList from './TemplatesList'
import TemplateTypesChips from './TemplateTypesChips'

type ListingRelatedProps = RequireOnlyOne<
  {
    listingId?: UUID
    listing?: IListing
  },
  'listing' | 'listingId'
>

type Props = {
  templateType?: IMarketingTemplateType
  medium?: IMarketingTemplateMedium
  onChangeTemplateType: (type: IMarketingTemplateType) => void
  onChangeMedium: (medium: IMarketingTemplateMedium) => void
} & ListingRelatedProps

export default function ListingMarketing({
  listing: passedListing,
  listingId,
  templateType,
  medium,
  onChangeTemplateType,
  onChangeMedium
}: Props) {
  const theme = useTheme()
  const user = useSelector(selectUser)
  const activeBrand = getActiveTeamId(user)

  const [selectedTemplate, setSelectedTemplate] =
    useState<Nullable<IBrandMarketingTemplate>>(null)

  const [listing, setListing] = useState<Nullable<IListing>>(null)
  const [isLoadingListing] = useLoadingEntities(listing)

  const { templates, isLoading: isLoadingTemplates } = useTemplates(
    activeBrand,
    undefined,
    LISTING_TEMPLATE_TYPES
  )

  const templateTypes = useUniqueTemplateTypes(templates)

  templateTypes.sort(
    (a, b) =>
      LISTING_TEMPLATE_TYPES.indexOf(a) - LISTING_TEMPLATE_TYPES.indexOf(b)
  )

  const mediums = useUniqueMediums(templates)

  mediums.sort((a, b) => ALL_MEDIUMS.indexOf(a) - ALL_MEDIUMS.indexOf(b))

  useEffect(() => {
    async function fetchListing() {
      if (passedListing) {
        setListing({
          ...passedListing,
          gallery_image_urls: getArrayWithFallbackAccessor(
            passedListing.gallery_image_urls ?? [],
            PLACEHOLDER_IMAGE_URL
          )
        })

        return
      }

      if (listingId) {
        const fetchedListing = await getListing(listingId)

        setListing({
          ...fetchedListing,
          gallery_image_urls: getArrayWithFallbackAccessor(
            fetchedListing.gallery_image_urls ?? [],
            PLACEHOLDER_IMAGE_URL
          )
        })
      }
    }

    fetchListing()
  }, [listingId, passedListing])

  const scrollToSelectedMedium = useCallback(() => {
    if (!medium) {
      return
    }

    const selectedMediumHeader = document.getElementById(medium)

    selectedMediumHeader?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start'
    })
  }, [medium])

  useEffect(() => {
    if (isLoadingListing || isLoadingTemplates || !listing || !medium) {
      return
    }

    let timeoutHandler: number

    setTimeout(scrollToSelectedMedium)

    return () => clearTimeout(timeoutHandler)
  }, [
    isLoadingListing,
    isLoadingTemplates,
    listing,
    medium,
    templateType,
    scrollToSelectedMedium
  ])

  const handleClickTemplateTypeChip = (type: IMarketingTemplateType) => {
    onChangeTemplateType(type)
  }

  const handleClickExpandMedium = (medium: IMarketingTemplateMedium) => {
    onChangeMedium(medium)
  }

  if (isLoadingListing || isLoadingTemplates || !listing) {
    return <LoadingContainer noPaddings />
  }

  const currentTemplateTypeTemplates = templates.filter(
    template =>
      template.template.template_type === (templateType ?? templateTypes[0])
  )

  const shouldShowAgentNetworkButton = hasUserAccessToAgentNetwork(user)
  const shouldShowOpenHouseButton =
    hasUserAccessToCrm(user) && hasUserAccessToMarketingCenter(user)
  const shouldShowWebsitesButton = hasUserAccessToWebsites(user)
  const shouldShowMarketingButtons =
    shouldShowAgentNetworkButton ||
    shouldShowOpenHouseButton ||
    shouldShowWebsitesButton

  return (
    <>
      <Grid container direction="row">
        {shouldShowMarketingButtons && (
          <Grid container item spacing={2}>
            {shouldShowAgentNetworkButton && (
              <Grid item xs={12} sm={6} md={4}>
                <MarketingButton
                  icon={
                    <SvgIcon
                      path={mdiAccountGroupOutline}
                      color={theme.palette.primary.main}
                      size={muiIconSizes.large}
                    />
                  }
                  title="Agent Network"
                  subtitle="Market this listing to top agents from any brokerage"
                  url={`/dashboard/agent-network/agents?listing=${listing.id}&title=${listing.property.address.street_address}`}
                />
              </Grid>
            )}

            {shouldShowOpenHouseButton && (
              <Grid item xs={12} sm={6} md={4}>
                <MarketingButton
                  icon={
                    <SvgIcon
                      path={meetingRoomOutlined}
                      color={theme.palette.primary.main}
                      size={muiIconSizes.large}
                    />
                  }
                  title="Open House"
                  subtitle="Customize Open House registration pages"
                  url="/dashboard/open-house"
                />
              </Grid>
            )}

            {shouldShowWebsitesButton && (
              <Grid item xs={12} sm={6} md={4}>
                <MarketingButton
                  icon={
                    <SvgIcon
                      path={mdiWeb}
                      color={theme.palette.primary.main}
                      size={muiIconSizes.large}
                    />
                  }
                  title="Websites"
                  subtitle="Create or manage websites for this listing"
                  url="/dashboard/websites"
                />
              </Grid>
            )}
          </Grid>
        )}
        <Grid container item>
          <Grid item xs={12}>
            <Box py={3}>
              <Divider />
            </Box>
          </Grid>
        </Grid>
        <TemplateTypesChips
          activeType={templateType ?? templateTypes[0]}
          types={templateTypes}
          onClick={handleClickTemplateTypeChip}
        />
        {mediums.map(currentMedium => {
          const currentMediumTemplates = currentTemplateTypeTemplates.filter(
            template => template.template.medium === currentMedium
          )

          if (currentMediumTemplates.length === 0) {
            return null
          }

          const currentMediumLabel = getTemplateMediumLabel(currentMedium)
          const isExpanded = medium === currentMedium

          return (
            <TemplatesList
              key={currentMedium}
              header={
                <Box display="flex">
                  {/* The `id` is here to be used with direct anchor links */}
                  <Typography variant="h5" id={currentMedium}>
                    {currentMediumLabel}
                  </Typography>
                </Box>
              }
              medium={currentMedium}
              mediumLabel={currentMediumLabel}
              listing={listing}
              templates={currentMediumTemplates}
              isExpanded={isExpanded}
              onExpandClick={() => handleClickExpandMedium(currentMedium)}
              onClick={setSelectedTemplate}
            />
          )
        })}
      </Grid>
      {selectedTemplate && (
        <SendMlsListingCard
          hasExternalTrigger
          isTriggered
          isTemplatesColumnHiddenDefault={false}
          mediums={medium}
          types={templateTypes}
          listing={listing}
          selectedTemplate={selectedTemplate}
          handleTrigger={() => setSelectedTemplate(null)}
        />
      )}
    </>
  )
}
