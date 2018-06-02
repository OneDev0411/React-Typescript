import React from 'react'
import { browserHistory } from 'react-router'

import Import from '../Import'
import PageHeader from '../../../../../../views/components/PageHeader'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

export function Header(props) {
  return (
    <PageHeader title="Contacts" backButton={false}>
      <PageHeader.Menu>
        <Import userId={props.user.id} />
        <ActionButton
          style={{ padding: '0.75em' }}
          onClick={() => browserHistory.push('/dashboard/contacts/new')}
        >
          New Contact
        </ActionButton>
      </PageHeader.Menu>
    </PageHeader>
  )
}

export default Header
