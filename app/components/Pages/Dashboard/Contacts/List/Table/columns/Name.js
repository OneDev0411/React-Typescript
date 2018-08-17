import React from 'react'
import { connect } from 'react-redux'
import Avatar from 'react-avatar'
import Flex from 'styled-flex-component'

import { selectDefinitionByName } from '../../../../../../../reducers/contacts/attributeDefs'

import { getContactAttribute } from '../../../../../../../models/contacts/helpers'

const ContactsListName = ({ contact, attributeDefs }) => {
  let avatar = ''
  const attribute_def = selectDefinitionByName(
    attributeDefs,
    'profile_image_url'
  )

  if (attribute_def) {
    const avatars = getContactAttribute(contact, attribute_def)

    avatar = avatars && avatars[0] && avatars[0].text
  }

  return (
    <Flex nowrap>
      <Avatar
        className="avatar"
        round
        name={contact.display_name}
        src={avatar}
        size={40}
      />
      <div style={{ fontWeight: 500, marginLeft: '16px' }}>
        {contact.display_name}
      </div>
    </Flex>
  )
}

function mapStateToProps(state) {
  const {
    contacts: { attributeDefs }
  } = state

  return { attributeDefs }
}

export default connect(mapStateToProps)(ContactsListName)
