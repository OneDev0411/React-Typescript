import React, { useState } from 'react'

import { mdiMapSearchOutline } from '@mdi/js'

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
          onClose={onClose}
          multipleSelection={isMultipleSelected}
          onSelectListingsCallback={handleSelect}
        />
      )}
    </AddAssociationButton>
  )
}
