import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import Flex from 'styled-flex-component'

import Import from '../Import'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

NoContact.propTypes = {
  user: PropTypes.shape().isRequired
}

export function NoContact(props) {
  return (
    <Flex full center column style={{ paddingTop: '15%' }}>
      <h3 style={{ marginBottom: '1em' }}>You don't have any contact yet!</h3>
      <p>To get started, hit the blue button to create a new contact</p>
      <Flex center>
        <Import userId={props.user.id} />
        <ActionButton
          style={{ padding: '0.75em' }}
          onClick={() => browserHistory.push('/dashboard/contacts/new')}
        >
          New Contact
        </ActionButton>
      </Flex>
    </Flex>
  )
}
