import React from 'react'
import AddContact from '../Add-Contact'
import ImportOutlook from './ImportOutlook'

export default ({ user, contactsCount, onNewContact }) => {
  if (contactsCount === 0) {
    return false
  }

  return (
    <div className="toolbar">
      <div className="info">
        <span className="title">All Contacts</span>

        <span className="count">{contactsCount} Contacts</span>
      </div>

      <div className="cta">
        <ImportOutlook userId={user.id} />

        <AddContact user={user} onNewContact={id => onNewContact(id)} />
      </div>
    </div>
  )
}
