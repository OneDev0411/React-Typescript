import React, { useState } from 'react'

import { normalizeContact } from '../../utils/association-normalizers'
import IconContact from '../SvgIcons/Contacts/IconContacts'
import { SearchContactDrawer } from '../SearchContactDrawer'

import { AddAssociationProps } from './types'
import { AddAssociationButton } from './AddAssociationButton'

export function AddContactAssociation({
  disabled,
  handleAdd,
  title = 'Attach Client'
}: AddAssociationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  const onSelect = contact => handleAdd(normalizeContact(contact), onClose)

  return (
    <AddAssociationButton
      title={title}
      Icon={IconContact}
      disabled={disabled}
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
