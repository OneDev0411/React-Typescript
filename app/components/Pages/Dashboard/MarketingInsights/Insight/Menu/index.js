import React from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import { CloseButton } from 'components/Button/CloseButton'

import Divider from './Divider'

function Menu(props) {
  const { closeButtonQuery, backUrl } = props

  return (
    <Flex alignCenter style={{ padding: '1.5em 0' }}>
      <Divider />
      <CloseButton
        isFit
        iconSize="large"
        inverse
        defaultBackUrl="/dashboard/contacts"
        backUrl={backUrl}
        query={closeButtonQuery}
      />
    </Flex>
  )
}

function mapStateToProps({ contacts }) {
  return {
    attributeDefs: contacts.attributeDefs
  }
}

export default connect(mapStateToProps)(Menu)
