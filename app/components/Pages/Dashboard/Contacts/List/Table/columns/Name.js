import React from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import { Typography, Tooltip } from '@material-ui/core'

import { getAttributeFromSummary } from 'models/contacts/helpers'

import { grey } from 'views/utils/colors'

import Link from 'components/ALink'
import MiniContact from 'components/MiniContact'
import PartnerIcon from 'components/SvgIcons/Partner/IconPartner'

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
          >
            <Typography noWrap variant="inherit" display="block">
              {name}
            </Typography>
          </Link>
        </MiniContact>
        {typeof contact.partner_name === 'string' &&
          contact.partner_name.trim().length > 0 && (
            <Tooltip title="Spouse/Partner">
              <Flex alignCenter>
                <PartnerIcon
                  style={{ width: '1rem', height: '1rem', fill: grey.A550 }}
                />
                <span
                  style={{
                    width: 'calc(100% - 1.24rem)',
                    marginLeft: '0.25rem',
                    color: grey.A550
                  }}
                  className="hover-color--black"
                >
                  <Typography noWrap variant="inherit" display="block">
                    {contact.partner_name}
                  </Typography>
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
