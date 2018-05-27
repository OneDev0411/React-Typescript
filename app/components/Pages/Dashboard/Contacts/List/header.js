import React from 'react'
import { browserHistory } from 'react-router'
import cn from 'classnames'

import Import from './Import'
import HeaderSearch from '../../../../Partials/headerSearch'
import ActionButton from '../../../../../views/components/Button/ActionButton'

function Header({ user, onInputChange, isSearching, filter }) {
  const isBackOffice = false

  return (
    <div className={cn('list--header no-box-shadow', { agent: !isBackOffice })}>
      <div style={{ height: '57px' }}>
        <div className={cn('list--header-row', { agent: !isBackOffice })}>
          <h1
            className="list--header-row--col"
            style={{ fontSize: '1.7rem', marginTop: '1em' }}
          >
            All Contacts
          </h1>

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
        inputValue={filter}
        isSearching={isSearching}
        onInputChange={onInputChange}
        placeholder="Search all contacts ..."
      />
    </div>
  )
}

export default Header
