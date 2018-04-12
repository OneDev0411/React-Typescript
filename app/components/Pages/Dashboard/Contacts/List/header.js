import React from 'react'
import AddContactModal from '../AddContactModal'
import Import from './Import'
import HeaderSearch from '../../../../Partials/headerSearch'
import cn from 'classnames'

export default ({ user, contactsCount, onNewContact, onInputChange }) => {
  if (contactsCount === 0) {
    return false
  }

  const isBackOffice = false

  return (
    <div className={cn('list--header no-box-shadow', { agent: !isBackOffice })}>
      <div style={{ height: '57px' }}>
        <div className={cn('list--header-row', { agent: !isBackOffice })}>
          <div className="list--header-row--col">
            <ul className="filter">
              <li>
                <span className="title">All Contacts</span>

                <span className="badge counter">{contactsCount} Contacts</span>
              </li>
            </ul>
          </div>

          <div className="list--header-row--col">
            <Import userId={user.id} />
            <AddContactModal
              user={user}
              onNewContact={id => onNewContact(id)}
            />
          </div>
        </div>
      </div>
      <HeaderSearch
        onInputChange={text => onInputChange(text)}
        placeholder="Search all contacts ..."
      />
    </div>
  )
}
