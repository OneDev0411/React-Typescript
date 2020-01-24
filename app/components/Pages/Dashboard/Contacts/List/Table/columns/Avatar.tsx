import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Avatar from 'react-avatar'

import ImageStatus from 'components/ImageStatus'
import { getAttributeFromSummary } from 'models/contacts/helpers'

import { IAppState } from 'reducers'
import { IAttributeDefsState } from 'reducers/contacts/attributeDefs'

import {
  getContactAttribute,
  getContactOnlineStatus
} from 'models/contacts/helpers'

import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'

const AvatarContainer = styled.div`
  display: table;
  position: relative;
  align-self: center;
  .avatar div {
    font-weight: 700 !important;
  }
`

const PATTERN = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/

interface StateProps {
  attributeDefs: IAttributeDefsState
}

interface Props {
  contact: INormalizedContact
}

function ContactAvatar({ contact, attributeDefs }: Props & StateProps) {
  const name = getAttributeFromSummary(contact, 'display_name')
  const statusColor = getContactOnlineStatus(contact) ? '#32b86d' : '#c3c3c3'

  return (
    <AvatarContainer>
      <Avatar
        color="#000"
        round
        name={name}
        src={getAvatarUrl(contact, attributeDefs)}
        size={40}
      />
      <ImageStatus statusColor={statusColor} />
    </AvatarContainer>
  )
}

function mapStateToProps({ contacts }: IAppState) {
  return { attributeDefs: contacts.attributeDefs }
}

function getAvatarUrl(contact, attributeDefs) {
  let avatar = ''

  const attribute_def = selectDefinitionByName(
    attributeDefs,
    'profile_image_url'
  )

  if (attribute_def) {
    const avatars = getContactAttribute(contact, attribute_def)

    avatar = avatars && avatars[0] && avatars[0].text

    if (!PATTERN.test(avatar)) {
      avatar = ''
    }
  }

  return avatar
}

export default connect(mapStateToProps)(ContactAvatar)
