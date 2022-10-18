import React, { useState } from 'react'

import { mdiMapSearchOutline } from '@mdi/js'

import useBrandAndDealsListings from '@app/hooks/use-brand-and-deals-listings'
import { GetBrandListingsOptions } from '@app/models/listings/search/get-brand-listings'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { normalizeListing } from '../../utils/association-normalizers'
import SearchListingsDrawer from '../SearchListingDrawer'

import { AddAssociationButton } from './AddAssociationButton'
import { AddAssociationProps } from './types'

const OPTIONS: GetBrandListingsOptions = {
  status: ['Active'],
  limit: 100
}

export function AddListingAssociation({
  disabled,
  handleAdd,
  isMultipleSelected,
  showTitle = false,
  isPrimary = false,
  title = 'Attach Property'
}: AddAssociationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { listings } = useBrandAndDealsListings(OPTIONS)

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
              items: listings
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
