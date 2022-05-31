import React from 'react'

import { mdiEmailOutline } from '@mdi/js'
import { connect } from 'react-redux'

import { GridActionButton } from '@app/views/components/Grid/Table/features/Actions/Button'
import SendEmailButton from 'components/SendEmailButton'
import { normalizeContact } from 'models/contacts/helpers/normalize-contact'
import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'
import { selectContact } from 'reducers/contacts/list'

interface Props {
  contacts: INormalizedContact[]
  disabled?: boolean
}

export function Email({ contacts, disabled }: Props) {
  return (
    <SendEmailButton
      disabled={disabled}
      size="small"
      recipients={normalizeContactsForEmailCompose(contacts)}
      render={({ onClick }) => (
        <GridActionButton
          label="Email"
          icon={mdiEmailOutline}
          disabled={disabled}
          onClick={onClick}
        />
      )}
    />
  )
}

function mapStateToProps(
  { contacts },
  { selectedRows }: { selectedRows: UUID[] }
) {
  const rawContacts: IContact[] = selectedRows
    .map(id => selectContact(contacts.list, id))
    .filter(id => !!id)

  const normalizedContacts = rawContacts.map(normalizeContact)

  return {
    contacts: normalizedContacts
  }
}

export default connect(mapStateToProps)(Email)
