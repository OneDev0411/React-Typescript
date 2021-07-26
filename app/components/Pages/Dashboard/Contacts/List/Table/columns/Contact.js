import React from 'react'

import styled from 'styled-components'

import { formatPhoneNumber } from 'utils/format'

import { getAttributeFromSummary } from '../../../../../../../models/contacts/helpers'
import { grey } from '../../../../../../../views/utils/colors'
import { TruncatedColumn } from '../styled'

const PhoneNumber = styled(TruncatedColumn)`
  color: ${({ email }) => (email ? grey.A550 : '#000')};
`
export function Contact(props) {
  const { contact } = props
  const email = getAttributeFromSummary(contact, 'email')

  return (
    <React.Fragment>
      <TruncatedColumn>{email}</TruncatedColumn>
      <PhoneNumber email={email} className="hover-color--black">
        {formatPhoneNumber(getAttributeFromSummary(contact, 'phone_number'))}
      </PhoneNumber>
    </React.Fragment>
  )
}
