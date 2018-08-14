import React from 'react'
import { connect } from 'react-redux'
import Avatar from 'react-avatar'

import { selectDefinitionByName } from '../../../../../../../reducers/contacts/attributeDefs'

import {
  getAttributeFromSummary,
  getContactAttribute
} from '../../../../../../../models/contacts/helpers'

const ContactsListName = ({ contact, attributeDefs }) => {
  const attribute_def = selectDefinitionByName(
    attributeDefs,
    'profile_image_url'
  )

  if (!attribute_def) {
    throw new Error(
      'Something went wrong. Attribute definition is not found for profile_image_url'
    )
  }

  const avatars = getContactAttribute(contact, attribute_def)
  const avatar = avatars && avatars[0] ? avatars[0].text : ''
  const name = getAttributeFromSummary(contact, 'display_name')

  return (
    <div className="name">
      <Avatar
        className="avatar"
        round
        name={name}
        src={avatar}
        size={35}
        style={{
          marginRight: '10px'
        }}
      />
      <span className="contact-name" style={{ fontWeight: 500 }}>
        {name}
      </span>
    </div>
  )
}

function mapStateToProps(state) {
  const {
    contacts: { attributeDefs }
  } = state

  return { attributeDefs }
}

export default connect(mapStateToProps)(ContactsListName)
