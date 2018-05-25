import React from 'react'
import { browserHistory } from 'react-router'

import Import from './Import'
import ActionButton from '../../../../../views/components/Button/ActionButton'

export default function NoContact({ user }) {
  return (
    <div className="no-contacts">
      <p className="title">You don't have contacts yet</p>
      <p>To get started, click the blue button to add contact</p>
      <div className="no-contacts--button-container">
        <ActionButton
          style={{ padding: '0.75em' }}
          onClick={() => browserHistory.push('/dashboard/contacts/new')}
        >
          New Contact
        </ActionButton>
        <Import userId={user.id} />
      </div>
    </div>
  )
}
