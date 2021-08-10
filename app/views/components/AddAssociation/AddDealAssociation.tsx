import React, { useState } from 'react'

import { mdiCashUsdOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { normalizeDeal } from '../../utils/association-normalizers'
import SearchDealDrawer from '../SearchDealDrawer'

import { AddAssociationButton } from './AddAssociationButton'
import { AddAssociationProps } from './types'

export function AddDealAssociation({
  disabled,
  handleAdd,
  showTitle = false,
  isPrimary = false,
  title = 'Attach Deal'
}: AddAssociationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  const onSelect = deal => handleAdd(normalizeDeal(deal), onClose)

  return (
    <AddAssociationButton
      title={title}
      Icon={<SvgIcon path={mdiCashUsdOutline} />}
      disabled={disabled}
      showTitle={showTitle}
      isPrimary={isPrimary}
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
