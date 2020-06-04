import React from 'react'

import { List } from '@material-ui/core'

import DuplicateContactsItem from '../DuplicateContactsItem'

interface Props {
  contacts: IContact[]
  masterId: UUID
  onDismissClick: React.ComponentProps<
    typeof DuplicateContactsItem
  >['onDismissClick']
  onSetMasterClick: React.ComponentProps<
    typeof DuplicateContactsItem
  >['onSetMasterClick']
}

export default function DuplicateContactsList({
  contacts,
  masterId,
  onDismissClick,
  onSetMasterClick
}: Props) {
  return (
    <List>
      {contacts.map(contact => (
        <DuplicateContactsItem
          isMaster={contact.id === masterId}
          key={contact.id}
          contact={contact}
          onDismissClick={onDismissClick}
          onSetMasterClick={onSetMasterClick}
        />
      ))}
    </List>
  )
}
