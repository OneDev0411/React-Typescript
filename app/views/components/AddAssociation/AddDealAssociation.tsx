import React, { useState } from 'react'

import IconDeal from '../SvgIcons/Deals/IconDeal'
import SearchDealDrawer from '../SearchDealDrawer'
import { normalizeDeal } from '../../utils/association-normalizers'

import { AddAssociationProps } from './types'
import { AddAssociationButton } from './AddAssociationButton'

export function AddDealAssociation({
  disabled,
  handleAdd,
  title = 'Attach Deal'
}: AddAssociationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  const onSelect = deal => handleAdd(normalizeDeal(deal), onClose)

  return (
    <AddAssociationButton
      title={title}
      Icon={IconDeal}
      disabled={disabled}
      onClick={onOpen}
    >
      {isOpen && (
        <SearchDealDrawer
          isOpen
          title={title}
          onClose={onClose}
          onSelect={onSelect}
        />
      )}
    </AddAssociationButton>
  )
}
