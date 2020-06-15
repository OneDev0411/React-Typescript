import React, { useState } from 'react'

import SearchListingsDrawer from '../SearchListingDrawer'
import IconListing from '../SvgIcons/Properties/IconProperties'
import { normalizeListing } from '../../utils/association-normalizers'

import { AddAssociationProps } from './types'
import { AddAssociationButton } from './AddAssociationButton'

export function AddListingAssociation({
  disabled,
  handleAdd,
  title = 'Attach Property'
}: AddAssociationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  const onSelect = listing => handleAdd(normalizeListing(listing), onClose)

  return (
    <AddAssociationButton
      title={title}
      Icon={IconListing}
      disabled={disabled}
      onClick={onOpen}
    >
      {isOpen && (
        <SearchListingsDrawer
          isOpen
          title={title}
          onClose={onClose}
          onSelectListingsCallback={listings => onSelect(listings[0])}
        />
      )}
    </AddAssociationButton>
  )
}
