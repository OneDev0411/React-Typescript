import React from 'react'
import Avatar from 'react-avatar'
import Contact from '../../../../../../models/contacts'
import LastSeen from '../../../Chatroom/Rooms/components/last-seen'

export default ({ contact }) => (
  <div className="card contact-info">
    <Avatar
      className="avatar"
      round
      name={Contact.get.name(contact)}
      src={Contact.get.avatar(contact)}
      size={90}
    />

    <div className="detail">
      <div className="name">{Contact.get.name(contact)}</div>

      <div className="status">
        {contact.users && <LastSeen user={contact.users[0]} />}
      </div>
    </div>
  </div>
)
