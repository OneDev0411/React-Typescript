import React from 'react'
import AddContact from '../Add-Contact'
import ImportOutlook from './ImportOutlook'
import ImportCSV from './ImportCsv'
import HeaderSearch from '../../../../Partials/headerSearch'
import cn from 'classnames'

export default ({ user, contactsCount, onNewContact, onInputChange }) => {
  if (contactsCount === 0) {
    return false
  }

  const isBackOffice = false

  return (
    <div className={cn('list--header', { agent: !isBackOffice })}>
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
            <ImportCSV />
            <ImportOutlook userId={user.id} />

            <AddContact user={user} onNewContact={id => onNewContact(id)} />
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
