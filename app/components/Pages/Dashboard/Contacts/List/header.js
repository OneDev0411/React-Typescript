import React from 'react'
import { browserHistory } from 'react-router'
import cn from 'classnames'

import Import from './Import'
import HeaderSearch from '../../../../Partials/headerSearch'
import ActionButton from '../../../../../views/components/Button/ActionButton'

function Header({ user, contactsCount, onInputChange, isSearching }) {
  if (contactsCount === 0) {
    return null
  }

  const isBackOffice = false

  return (
    <div className={cn('list--header no-box-shadow', { agent: !isBackOffice })}>
      <div style={{ height: '57px' }}>
        <div className={cn('list--header-row', { agent: !isBackOffice })}>
          <div className="list--header-row--col">
            <ul className="filter">
              <li style={{ cursor: 'initial' }}>
                <h4 className="title">All Contacts</h4>

                <span className="badge counter">
                  {contactsCount.toLocaleString()} Contacts
                </span>
              </li>
            </ul>
          </div>

          <div className="list--header-row--col">
            <Import userId={user.id} />
            <ActionButton
              style={{ padding: '0.75em' }}
              onClick={() => browserHistory.push('/dashboard/contacts/new')}
            >
              New Contact
            </ActionButton>
          </div>
        </div>
      </div>
      <HeaderSearch
        isSearching={isSearching}
        onInputChange={text => onInputChange(text)}
        placeholder="Search all contacts ..."
      />
    </div>
  )
}

export default Header
