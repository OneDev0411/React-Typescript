import React, { useState } from 'react'

import { mdiCardAccountDetailsOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { normalizeContact } from '../../utils/association-normalizers'

import { SearchContactDrawer } from '../SearchContactDrawer'

import { AddAssociationProps } from './types'
import { AddAssociationButton } from './AddAssociationButton'

export function AddContactAssociation({
  disabled,
  handleAdd,
  showTitle = false,
  title = 'Attach Client'
}: AddAssociationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  const onSelect = contact => handleAdd(normalizeContact(contact), onClose)

  return (
    <AddAssociationButton
      title={title}
      Icon={<SvgIcon path={mdiCardAccountDetailsOutline} />}
      disabled={disabled}
      showTitle={showTitle}
      onClick={onOpen}
    >
      {isOpen && (
        <SearchContactDrawer
          isOpen
          title={title}
          onClose={onClose}
          onSelect={onSelect}
        />
      )}
    </AddAssociationButton>
  )
}
