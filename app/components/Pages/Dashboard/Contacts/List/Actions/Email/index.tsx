import React from 'react'
import { connect } from 'react-redux'

import { normalizeContact } from 'models/contacts/helpers/normalize-contact'
import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'

import { selectContact } from 'reducers/contacts/list'

import SendEmailButton from 'components/SendEmailButton'

interface Props {
  contacts: INormalizedContact[]
  disabled?: boolean
}

export function Email({ contacts, disabled }: Props) {
  return (
    // @ts-ignore
    // TODO: refactor SendEmailButton with TS
    <SendEmailButton
      disabled={disabled}
      size="small"
      recipients={normalizeContactsForEmailCompose(contacts)}
      style={{
        fontSize: '0.875rem'
      }}
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
