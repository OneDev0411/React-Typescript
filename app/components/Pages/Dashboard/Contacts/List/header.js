import React, { Fragment } from 'react'
import { browserHistory } from 'react-router'
import Import from './Import'
// import HeaderSearch from '../../../../Partials/headerSearch'
import ActionButton from '../../../../../views/components/Button/ActionButton'
import PageHeader from '../../../../../views/components/PageHeader'

function Header({ user, contactsCount }) {
  if (contactsCount === 0) {
    return null
  }

  return (
    <PageHeader isFlat>
      <PageHeader.Title title="All Contacts" backButton={false}>
        <span className="badge counter">
          {contactsCount.toLocaleString()} Contacts
        </span>
      </PageHeader.Title>

      <PageHeader.Menu>
        <Fragment>
          <Import userId={user.id} />
          <ActionButton
            style={{ padding: '0.75em' }}
            onClick={() => browserHistory.push('/dashboard/contacts/new')}
          >
            New Contact
          </ActionButton>
        </Fragment>
      </PageHeader.Menu>
    </PageHeader>
  )
}

export default Header
