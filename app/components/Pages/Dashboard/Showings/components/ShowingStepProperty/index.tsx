import React, { useState } from 'react'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm,
  useWizardContext
} from 'components/QuestionWizard'
import ListingsAndPlacesSearchInput from 'components/ListingsAndPlacesSearchInput'

import { SearchResult } from 'components/ListingsAndPlacesSearchInput/types'

import { ShowingPropertyType } from '../../types'
import {
  getStdAddrFromAddressComponents,
  getFullAddressFromSrdAddr
} from './helpers'
import ShowingStepPropertyForm, {
  ShowingStepPropertyFormProps
} from './ShowingStepPropertyForm'
import ShowingStepPropertyListingCard from './ShowingStepPropertyListingCard'

export interface ShowingStepPropertyProps {
  property: Nullable<ShowingPropertyType>
  onPropertyChange: (value: ShowingPropertyType) => void
}

function ShowingStepProperty({
  property,
  onPropertyChange
}: ShowingStepPropertyProps) {
  const wizard = useWizardContext()
  const [isSearchMode, setIsSearchMode] = useState(!property)
  const [isEditMode, setIsEditMode] = useState(false)

  const handleSearchResultSelect = (result: SearchResult) => {
    // TODO: add deal condition here
    if (result.type === 'listing' /* || result.type === 'deal' */) {
      onPropertyChange(result)
      wizard.next()
    } else if (result.type === 'place') {
      onPropertyChange({
        type: 'place',
        address: getStdAddrFromAddressComponents(
          result.place.address_components
        ),
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
    wizard.next()
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
      <QuestionForm>
        {isSearchMode ? (
          <ListingsAndPlacesSearchInput onSelect={handleSearchResultSelect} />
        ) : (
          <>
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
      </QuestionForm>
    </QuestionSection>
  )
}

export default ShowingStepProperty
