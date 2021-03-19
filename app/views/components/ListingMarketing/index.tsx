import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Grid, makeStyles } from '@material-ui/core'

import getListing from 'models/listings/listing/get-listing'
import { selectUser } from 'selectors/user'
import { getActiveTeamId } from 'utils/user-teams'
import { useLoadingEntities } from 'hooks/use-loading'
import { useUniqueTemplateTypes } from 'hooks/use-unique-template-types'
import { useUniqueMediums } from 'hooks/use-unique-mediums'
import { getTemplateMediumLabel } from 'utils/marketing-center/get-template-medium-label'

import LoadingContainer from 'components/LoadingContainer'
import SendMlsListingCard from 'components/InstantMarketing/adapters/SendMlsListingCard'

import { useTemplates } from '../../../components/Pages/Dashboard/Marketing/hooks/use-templates'
import {
  ALL_MEDIUMS,
  LISTING_TEMPLATE_TYPES
} from '../../../components/Pages/Dashboard/Marketing/Wizard/constants'

import TemplateTypesChips from './TemplateTypesChips'
import TemplatesRow from './TemplatesRow'

const useStyles = makeStyles(
  () => ({
    container: {
      overflowX: 'hidden'
    }
  }),
  {
    name: 'ListingMarketing'
  }
)

type Props = RequireOnlyOne<
  {
    listingId?: UUID
    listing?: IListing
    defaultTemplateType?: IMarketingTemplateType
  },
  'listing' | 'listingId'
>

export default function ListingMarketing({
  listing: passedListing,
  listingId,
  defaultTemplateType
}: Props) {
  const classes = useStyles()
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

  if (isLoadingListing || isLoadingTemplates || !listing) {
    return <LoadingContainer noPaddings />
  }

  const currentTemplateTypeTemplates = templates.filter(
    template =>
      template.template.template_type ===
      (selectedTemplateType ?? templateTypes[0])
  )

  return (
    <>
      <Grid container direction="row" className={classes.container}>
        <TemplateTypesChips
          activeType={selectedTemplateType ?? templateTypes[0]}
          types={templateTypes}
          onClick={setSelectedTemplateType}
        />
        {mediums.map(medium => {
          const currentMediumTemplates = currentTemplateTypeTemplates
            .filter(template => template.template.medium === medium)
            .slice(0, 4)

          if (currentMediumTemplates.length === 0) {
            return null
          }

          const mediumLabel = getTemplateMediumLabel(medium)

          return (
            <TemplatesRow
              key={medium}
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
