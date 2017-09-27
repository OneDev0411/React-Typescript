import React from 'react'
import AddContact from '../Add-Contact'

export default ({
  user,
  contactsCount
}) => {
  if (contactsCount > 0) {
    return false
  }

  return (
    <div className="no-contacts">
      <p className="title">You don't have contacts yet</p>
      <p>To get started, click the blue button to add contact</p>
      <AddContact
        user={user}
        onNewContact={(id) => onNewContact(id)}
      />
    </div>
  )
}
