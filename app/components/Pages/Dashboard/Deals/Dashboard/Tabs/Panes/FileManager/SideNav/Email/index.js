import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import copy from 'utils/copy-text-to-clipboard'

import IconEmail from 'components/SvgIcons/DealEmail/IconEmail'
import { Container, Text, EmailLink } from './styled'

function DealEmail({ deal, notify }) {
  return (
    <Container>
      <IconEmail />

      <Text>Email files to this deal</Text>

      <EmailLink
        onClick={() => {
          copy(deal.email)
          notify({
            message: 'Link Copied',
            status: 'success'
          })
        }}
      >
        {deal.email}
      </EmailLink>
    </Container>
  )
}

export default connect(
  null,
  { notify }
)(DealEmail)
