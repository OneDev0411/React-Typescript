import React from 'react'
// import Avatar from 'react-avatar'
import Contact from '../../../../../../models/contacts'
import LastSeen from '../../../Chatroom/Rooms/components/last-seen'
import Avatar from './components/Avatar'

export default ({ contact }) => (
  <div className="c-contact-info c-contact-profile-card">
    <Avatar contact={contact} />

    <div className="c-contact-info__detail">
      <div className="c-contact-info__name">{Contact.get.name(contact)}</div>

      <div className="c-contact-info__status">
        {contact.users && <LastSeen user={contact.users[0]} />}
      </div>
    </div>
  </div>
)
