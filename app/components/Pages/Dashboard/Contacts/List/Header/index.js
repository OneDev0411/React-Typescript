import React from 'react'
import { browserHistory } from 'react-router'

import Import from '../Import'
import PageHeader from '../../../../../../views/components/PageHeader'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

import { Trigger as MenuTrigger } from '../../../../../../views/components/SlideMenu'

export function Header({ user, contactsCount, onMenuTriggerChange }) {
  return (
    <PageHeader isFlat>
      <PageHeader.Title backButton={false}>
        <MenuTrigger onClick={onMenuTriggerChange} />
        <PageHeader.Heading>All Contacts</PageHeader.Heading>
        <span className="badge counter">
          {contactsCount.toLocaleString()} Contacts
        </span>
      </PageHeader.Title>

      <PageHeader.Menu>
        <Import userId={user.id} />
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
