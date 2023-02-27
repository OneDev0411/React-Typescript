import React, { useState, useMemo } from 'react'

import { mdiMapSearchOutline } from '@mdi/js'

import { useBrandListings, useDealsListings } from '@app/hooks/use-listings'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { normalizeListing } from '../../utils/association-normalizers'
import SearchListingsDrawer from '../SearchListingDrawer'

import { AddAssociationButton } from './AddAssociationButton'
import { AddAssociationProps } from './types'

export function AddListingAssociation({
  disabled,
  handleAdd,
  isMultipleSelected,
  showTitle = false,
  isPrimary = false,
  title = 'Attach Property'
}: AddAssociationProps) {
  const [isOpen, setIsOpen] = useState(false)
  // Brand Listings
  const brandListings = useBrandListings({
    filters: { listing_statuses: ['Active'] },
    options: { limit: 10 }
  })
  const brandListingsIds = useMemo(
    () => brandListings?.map(listing => listing.id),
    [brandListings]
  )
  // Deals Listings
  const { listings: dealListings } = useDealsListings({
    filters: { listingIdsToExclude: brandListingsIds },
    options: { limit: 10 }
  })

  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  const handleSelect = (listings: IListing[]) =>
    handleAdd(
      listings.map(listing => normalizeListing(listing)),
      onClose
    )

  return (
    <AddAssociationButton
      title={title}
      Icon={<SvgIcon path={mdiMapSearchOutline} />}
      disabled={disabled}
      showTitle={showTitle}
      isPrimary={isPrimary}
      onClick={onOpen}
    >
      {isOpen && (
        <SearchListingsDrawer
          isOpen
          title={title}
          defaultLists={[
            {
              title: 'Add from your MLS listings',
              items: brandListings
            },
            {
              title: 'Add from your deals',
              items: dealListings
            }
          ]}
          onClose={onClose}
          multipleSelection={isMultipleSelected}
          onSelectListingsCallback={handleSelect}
        />
      )}
    </AddAssociationButton>
  )
}
