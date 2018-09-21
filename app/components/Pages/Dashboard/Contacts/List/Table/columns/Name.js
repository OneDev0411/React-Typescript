import React from 'react'
import { connect } from 'react-redux'
import Avatar from 'react-avatar'
import Flex from 'styled-flex-component'

import { selectDefinitionByName } from '../../../../../../../reducers/contacts/attributeDefs'
import Link from '../../../../../../../views/components/ALink'
import { getContactAttribute } from '../../../../../../../models/contacts/helpers'
import styled from 'styled-components'

const AvatarContainer = styled.div`
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
  }

  return (
    <Flex nowrap>
      <AvatarContainer>
        <Avatar
          className="avatar"
          color="#000000"
          round
          name={contact.display_name}
          src={avatar}
          size={40}
        />
      </AvatarContainer>
      <Link
        to={`/dashboard/contacts/${contact.id}`}
        style={{
          fontWeight: 500,
          marginLeft: '16px',
          padding: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {contact.display_name}
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
