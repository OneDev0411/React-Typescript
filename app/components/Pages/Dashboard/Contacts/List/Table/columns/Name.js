import React from 'react'
import { connect } from 'react-redux'
import Avatar from 'react-avatar'
import Flex from 'styled-flex-component'

import styled from 'styled-components'

import { selectDefinitionByName } from '../../../../../../../reducers/contacts/attributeDefs'
import { grey } from '../../../../../../../views/utils/colors'
import Link from '../../../../../../../views/components/ALink'
import Tooltip from '../../../../../../../views/components/tooltip'
import PartnerIcon from '../../../../../../../views/components/SvgIcons/Partner/IconPartner'
import {
  getContactAttribute,
  getAttributeFromSummary,
  getContactOnlineStatus
} from '../../../../../../../models/contacts/helpers'

import ImageStatus from '../../../../../../../views/components/ImageStatus'

const ellipsis = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}

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

  const is_user_active = getContactOnlineStatus(contact)

  const statusColor = is_user_active ? '#32b86d' : '#c3c3c3'

  return (
    <Flex nowrap style={{ minWidth: '0' }}>
      <AvatarContainer>
        <Avatar
          className="avatar"
          color="#000"
          round
          name={name}
          src={avatar}
          size={40}
        />
        <ImageStatus statusColor={statusColor} />
      </AvatarContainer>
      <Flex
        column
        style={{
          marginLeft: '1rem',
          marginTop: '-0.25rem',
          overflow: 'hidden'
        }}
      >
        <Link
          to={`/dashboard/contacts/${contact.id}`}
          style={{
            ...ellipsis,
            fontWeight: 500,
            padding: 0
          }}
        >
          {name}
        </Link>
        {typeof contact.partner_name === 'string' &&
          contact.partner_name.trim().length > 0 && (
            <Tooltip caption="Spouse/Partner">
              <Flex alignCenter>
                <PartnerIcon
                  style={{ width: '1rem', height: '1rem', fill: grey.A550 }}
                />
                <span
                  style={{
                    ...ellipsis,
                    width: 'calc(100% - 1.24rem)',
                    marginLeft: '0.25rem',
                    color: grey.A550
                  }}
                  className="hover-color--black"
                >
                  {contact.partner_name}
                </span>
              </Flex>
            </Tooltip>
          )}
      </Flex>
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
