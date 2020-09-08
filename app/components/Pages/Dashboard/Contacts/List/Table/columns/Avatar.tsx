import React from 'react'
import { connect } from 'react-redux'

import { Avatar } from 'components/Avatar'

import {
  getAttributeFromSummary,
  getContactNameInitials
} from 'models/contacts/helpers'

import { IAppState } from 'reducers'
import { IAttributeDefsState } from 'reducers/contacts/attributeDefs'

import { getContactOnlineStatus } from 'models/contacts/helpers'

interface StateProps {
  attributeDefs: IAttributeDefsState
}

interface Props {
  contact: INormalizedContact
}

function ContactAvatar({ contact, attributeDefs }: Props & StateProps) {
  const name = getAttributeFromSummary(contact, 'display_name')

  return (
    <Avatar
      alt={name}
      contact={contact}
      showStatus
      isOnline={getContactOnlineStatus(contact)}
    >
      {getContactNameInitials(contact)}
    </Avatar>
  )
}

function mapStateToProps({ contacts }: IAppState) {
  return { attributeDefs: contacts.attributeDefs }
}

export default connect(mapStateToProps)(ContactAvatar)
