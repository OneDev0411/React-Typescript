import React, { memo, useState } from 'react'

import { QuestionSection, QuestionTitle } from 'components/QuestionWizard'
import DealsAndListingsAndPlacesSearchInput from 'components/DealsAndListingsAndPlacesSearchInput'

import {
  SearchResult,
  SearchResultType
} from 'components/DealsAndListingsAndPlacesSearchInput/types'

import { ShowingPropertyType } from '../../types'
import {
  getStdAddrFromAddressComponents,
  getFullAddressFromSrdAddr
} from './helpers'
import ShowingStepPropertyForm, {
  ShowingStepPropertyFormProps
} from './ShowingStepPropertyForm'
import ShowingStepPropertyListingCard from './ShowingStepPropertyListingCard'
import ShowingStepPropertyDealListingCard from './ShowingStepPropertyDealListingCard'
import useQuestionWizardSmartNext from '../use-question-wizard-smart-next'
import SmartQuestionForm from '../SmartQuestionForm'

export interface ShowingStepPropertyProps {
  property: Nullable<ShowingPropertyType>
  onPropertyChange: (value: ShowingPropertyType) => void
}

const SEARCH_RESULT_TYPES: SearchResultType[] = ['deal', 'listing', 'place']

function ShowingStepProperty({
  property,
  onPropertyChange
}: ShowingStepPropertyProps) {
  const nextStep = useQuestionWizardSmartNext()
  const [isSearchMode, setIsSearchMode] = useState(!property)
  const [isEditMode, setIsEditMode] = useState(false)

  const handleSearchResultSelect = (result: SearchResult) => {
    if (result.type === 'listing' || result.type === 'deal') {
      onPropertyChange(result)
      console.log('result', result)
      nextStep()
    } else if (result.type === 'place') {
      onPropertyChange({
        type: 'place',
        address: {
          ...getStdAddrFromAddressComponents(result.place.address_components),
          full: result.place.formatted_address
        },
        gallery: [],
        price: 0
      })
      setIsEditMode(true)
    }

    setIsSearchMode(false)
  }

  const goToSearchMode = () => {
    setIsSearchMode(true)
  }

  const handlePropertyFormConfirm: ShowingStepPropertyFormProps['onConfirm'] = formData => {
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
    <QuestionSection>
      <QuestionTitle>What is the address for the property?</QuestionTitle>
      <SmartQuestionForm>
        {isSearchMode ? (
          <DealsAndListingsAndPlacesSearchInput
            onSelect={handleSearchResultSelect}
            autoFocus
            searchTypes={SEARCH_RESULT_TYPES}
          />
        ) : (
          <>
            {property?.type === 'deal' && (
              <ShowingStepPropertyDealListingCard
                listing={property.deal.listing}
                onChange={goToSearchMode}
                changeLabel="Change Property"
              />
            )}
            {property?.type === 'listing' && (
              <ShowingStepPropertyListingCard
                listing={property.listing}
                onChange={goToSearchMode}
                changeLabel="Change Property"
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
                    price: property.price
                  } as ICompactListing
                }
                hideFeatures
                customChip={<span />}
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
