import React from 'react'
import styled from 'styled-components'

import { TruncatedColumn } from '../styled'
import { getAttributeFromSummary } from '../../../../../../../models/contacts/helpers'
import { grey } from '../../../../../../../views/utils/colors'

const PhoneNumber = styled(TruncatedColumn)`
  color: ${({ email }) => (email ? grey.A550 : '#000')};
`
export function Contact(props) {
  const { contact } = props
  const email = getAttributeFromSummary(contact, 'email')

  return (
    <React.Fragment>
      <TruncatedColumn>{email}</TruncatedColumn>
      <PhoneNumber email={email} className="blackHover">
        {getAttributeFromSummary(contact, 'phone_number')}
      </PhoneNumber>
    </React.Fragment>
  )
}
