import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Grid, Divider, useTheme, Box } from '@material-ui/core'
import { mdiAccountGroupOutline, mdiWeb } from '@mdi/js'

import getListing from 'models/listings/listing/get-listing'
import { selectUser } from 'selectors/user'
import { getActiveTeamId } from 'utils/user-teams'
import { useLoadingEntities } from 'hooks/use-loading'
import { useUniqueTemplateTypes } from 'hooks/use-unique-template-types'
import { useUniqueMediums } from 'hooks/use-unique-mediums'
import { getTemplateMediumLabel } from 'utils/marketing-center/get-template-medium-label'
import {
  hasUserAccessToCrm,
  hasUserAccessToMarketingCenter,
  hasUserAccessToAgentNetwork,
  hasUserAccessToWebsites
} from 'utils/user-teams'

import LoadingContainer from 'components/LoadingContainer'
import SendMlsListingCard from 'components/InstantMarketing/adapters/SendMlsListingCard'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { meetingRoomOutlined } from 'components/SvgIcons/icons'

import { useTemplates } from '../../../components/Pages/Dashboard/Marketing/hooks/use-templates'
import {
  ALL_MEDIUMS,
  LISTING_TEMPLATE_TYPES
} from '../../../components/Pages/Dashboard/Marketing/Wizard/constants'

import MarketingButton from './MarketingButton'
import TemplateTypesChips from './TemplateTypesChips'
import TemplatesRow from './TemplatesRow'

type ListingRelatedProps = RequireOnlyOne<
  {
    listingId?: UUID
    listing?: IListing
  },
  'listing' | 'listingId'
>

type Props = {
  defaultTemplateType?: IMarketingTemplateType
  defaultMedium?: IMarketingTemplateMedium
} & ListingRelatedProps

export default function ListingMarketing({
  listing: passedListing,
  listingId,
  defaultTemplateType,
  defaultMedium
}: Props) {
  const theme = useTheme()
  const user = useSelector(selectUser)
  const activeBrand = getActiveTeamId(user)

  const [selectedTemplateType, setSelectedTemplateType] = useState<
    Nullable<IMarketingTemplateType>
  >(defaultTemplateType ?? null)

  const [selectedTemplate, setSelectedTemplate] = useState<
    Nullable<IBrandMarketingTemplate>
  >(null)

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
        setListing(passedListing)

        return
      }

      if (listingId) {
        const fetchedListing = await getListing(listingId)

        setListing(fetchedListing)
      }
    }

    fetchListing()
  }, [listingId, passedListing])

  useEffect(() => {
    let timeoutHandler: number

    function scrollToSelectedMedium() {
      if (isLoadingListing || isLoadingTemplates || !listing) {
        return
      }

      if (!defaultMedium) {
        return
      }

      timeoutHandler = setTimeout(() => {
        const selectedMediumHeader = document.getElementById(defaultMedium)

        selectedMediumHeader?.scrollIntoView({
          behavior: 'smooth',
          inline: 'start'
        })
      })

      return () => {
        clearTimeout(timeoutHandler)
      }
    }

    scrollToSelectedMedium()
  }, [isLoadingListing, isLoadingTemplates, listing, defaultMedium])

  const handleClickTemplateTypeChip = (type: IMarketingTemplateType) => {
    setSelectedTemplateType(type)
  }

  if (isLoadingListing || isLoadingTemplates || !listing) {
    return <LoadingContainer noPaddings />
  }

  const currentTemplateTypeTemplates = templates.filter(
    template =>
      template.template.template_type ===
      (selectedTemplateType ?? templateTypes[0])
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
          activeType={selectedTemplateType ?? templateTypes[0]}
          types={templateTypes}
          onClick={handleClickTemplateTypeChip}
        />
        {mediums.map(medium => {
          const currentMediumTemplates = currentTemplateTypeTemplates
            .filter(template => template.template.medium === medium)
            .slice(0, 6)

          if (currentMediumTemplates.length === 0) {
            return null
          }

          const mediumLabel = getTemplateMediumLabel(medium)

          return (
            <TemplatesRow
              key={medium}
              medium={medium}
              title={mediumLabel}
              listing={listing}
              templates={currentMediumTemplates}
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
          mediums={selectedTemplate.template.medium}
          types={selectedTemplate.template.template_type}
          listing={listing}
          selectedTemplate={selectedTemplate}
          handleTrigger={() => setSelectedTemplate(null)}
        />
      )}
    </>
  )
}
