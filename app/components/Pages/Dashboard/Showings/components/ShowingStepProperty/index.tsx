import React, { memo, useState } from 'react'

import DealsAndListingsAndPlacesSearchInput from 'components/DealsAndListingsAndPlacesSearchInput'
import {
  SearchResult,
  SearchResultType
} from 'components/DealsAndListingsAndPlacesSearchInput/types'
import {
  QuestionSection,
  QuestionSectionProps,
  QuestionTitle
} from 'components/QuestionWizard'

import { getFullAddressFromSrdAddr } from '../../helpers'
import useQuestionWizardSmartNext from '../../hooks/use-question-wizard-smart-next'
import { ShowingPropertyType } from '../../types'
import ListingHipPocketCard from '../ListingHipPocketCard'
import SmartQuestionForm from '../SmartQuestionForm'

import { getStdAddrFromAddressComponents } from './helpers'
import ShowingStepPropertyChangeButton from './ShowingStepPropertyChangeButton'
import ShowingStepPropertyDealListingCard from './ShowingStepPropertyDealListingCard'
import ShowingStepPropertyForm, {
  ShowingStepPropertyFormProps
} from './ShowingStepPropertyForm'
import ShowingStepPropertyListingCard from './ShowingStepPropertyListingCard'

export interface ShowingStepPropertyProps
  extends Pick<QuestionSectionProps, 'error'> {
  property: Nullable<ShowingPropertyType>
  onPropertyChange: (value: ShowingPropertyType) => void
}

const SEARCH_RESULT_TYPES: SearchResultType[] = [
  'deal',
  'listing' /* , 'place' */
]

function ShowingStepProperty({
  property,
  onPropertyChange,
  error
}: ShowingStepPropertyProps) {
  const nextStep = useQuestionWizardSmartNext()
  const [isSearchMode, setIsSearchMode] = useState(!property)
  const [isEditMode, setIsEditMode] = useState(false)

  const handleSearchResultSelect = (result: SearchResult) => {
    if (result.type === 'listing' || result.type === 'deal') {
      onPropertyChange(result)
      nextStep()
    } else if (result.type === 'place') {
      onPropertyChange({
        type: 'place',
        address: {
          ...getStdAddrFromAddressComponents(result.place.address_components),
          full: result.place.formatted_address
        },
        gallery: []
      })
      setIsEditMode(true)
    }

    setIsSearchMode(false)
  }

  const goToSearchMode = () => {
    setIsSearchMode(true)
  }

  const handlePropertyFormConfirm: ShowingStepPropertyFormProps['onConfirm'] =
    formData => {
      onPropertyChange({
        type: 'place',
        ...formData
      })
      setIsEditMode(false)
      nextStep()
    }

  const handlePropertyFormCancel = () => {
    setIsEditMode(false)
  }

  const goToEditMode = () => {
    setIsEditMode(true)
  }

  return (
    <QuestionSection error={error}>
      <QuestionTitle>What is the address for the property?</QuestionTitle>
      <SmartQuestionForm>
        {isSearchMode ? (
          <DealsAndListingsAndPlacesSearchInput
            textFieldProps={{
              autoFocus: true
            }}
            onSelect={handleSearchResultSelect}
            searchTypes={SEARCH_RESULT_TYPES}
          />
        ) : (
          <>
            {property?.type === 'deal' && property.deal.listing && (
              <ShowingStepPropertyDealListingCard
                listing={property.deal.listing}
                onChange={goToSearchMode}
                changeLabel="Change Property"
              />
            )}
            {property?.type === 'deal' && !property.deal.listing && (
              <>
                <ListingHipPocketCard title={property.deal.title} />
                <ShowingStepPropertyChangeButton onClick={goToSearchMode} />
              </>
            )}
            {property?.type === 'listing' && (
              <ShowingStepPropertyListingCard
                listing={property.listing}
                onChange={goToSearchMode}
              />
            )}
            {property?.type === 'place' && isEditMode && (
              <ShowingStepPropertyForm
                initialData={property}
                onBack={goToSearchMode}
                onConfirm={handlePropertyFormConfirm}
                onCancel={handlePropertyFormCancel}
              />
            )}
            {property?.type === 'place' && !isEditMode && (
              <ShowingStepPropertyListingCard
                listing={
                  {
                    type: 'compact_listing',
                    address: {
                      street_address: getFullAddressFromSrdAddr(
                        property.address
                      )
                    },
                    compact_property: {
                      bedroom_count: 0,
                      bathroom_count: 0,
                      square_meters: 0,
                      lot_size_area: 0
                    },
                    price: 0
                  } as ICompactListing
                }
                hideFeatures
                changeLabel="Edit Property Details"
                onChange={goToEditMode}
              />
            )}
          </>
        )}
      </SmartQuestionForm>
    </QuestionSection>
  )
}

export default memo(ShowingStepProperty)
