import React from 'react'
import { connect } from 'react-redux'
import Avatar from 'react-avatar'
import Flex from 'styled-flex-component'

import { selectDefinitionByName } from '../../../../../../../reducers/contacts/attributeDefs'
import Link from '../../../../../../../views/components/ALink'
import {
  getContactAttribute,
  getAttributeFromSummary
} from '../../../../../../../models/contacts/helpers'
import styled from 'styled-components'
import ImageStatus from '../../../../../../../views/components/ImageStatus'

const AvatarContainer = styled.div`
  display: table;
  position: relative;
  align-self: center;
  .avatar div {
    font-weight: 700 !important;
  }
`
const ContactsListName = ({ contact, attributeDefs }) => {
  let avatar = ''
  const attribute_def = selectDefinitionByName(
    attributeDefs,
    'profile_image_url'
  )

  if (attribute_def) {
    const avatars = getContactAttribute(contact, attribute_def)

    avatar = avatars && avatars[0] && avatars[0].text

    if (
      !/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(
        avatar
      )
    ) {
      avatar = ''
    }
  }

  const name = getAttributeFromSummary(contact, 'display_name')

  let userStatuses = []

  contact.sub_contacts.forEach(
    ({ users: subContactUsers }) =>
      subContactUsers &&
      subContactUsers.forEach(user => userStatuses.push(user.user_status))
  )

  let statusColor

  if (userStatuses.length > 0) {
    if (userStatuses[0] === 'Active') {
      statusColor = '#32b86d'
    } else {
      statusColor = '#c3c3c3'
    }
  }

  return (
    <Flex nowrap>
      <AvatarContainer>
        <Avatar
          className="avatar"
          color="#000000"
          round
          name={name}
          src={avatar}
          size={40}
        />
        <ImageStatus statusColor={statusColor} />
      </AvatarContainer>
      <Link
        to={`/dashboard/contacts/${contact.id}`}
        style={{
          fontWeight: 500,
          marginLeft: '16px',
          padding: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginTop: '-4px'
        }}
      >
        {name}
      </Link>
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
