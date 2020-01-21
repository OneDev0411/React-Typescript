import React from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import { getAttributeFromSummary } from 'models/contacts/helpers'

import { grey } from 'views/utils/colors'

import Link from 'components/ALink'
import Tooltip from 'components/tooltip'
import MiniContact from 'components/MiniContact'
import PartnerIcon from 'components/SvgIcons/Partner/IconPartner'

const ellipsis = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}

const ContactsListName = ({ contact }) => {
  const name = getAttributeFromSummary(contact, 'display_name')

  const s = contact.meta && contact.meta.s ? contact.meta.s : '0'

  return (
    <Flex nowrap style={{ minWidth: '0' }}>
      <Flex
        column
        style={{
          marginLeft: '1rem',
          marginTop: '-0.25rem',
          overflow: 'hidden'
        }}
      >
        <MiniContact type="contact" data={contact}>
          <Link
            data-test="contact-link"
            to={{
              pathname: `/dashboard/contacts/${contact.id}`,
              state: {
                id: contact.id,
                s
              }
            }}
            style={{
              ...ellipsis,
              fontWeight: 500,
              padding: 0
            }}
          >
            {name}
          </Link>
        </MiniContact>
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
