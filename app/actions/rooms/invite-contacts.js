// actions/rooms/invite-contacts.js
import Room from '../../models/Room'
import AppStore from '../../stores/AppStore'

export default (user, room, contacts) => {
  const invitations = contacts.map(contact => {
    const invitation = {
      room: room.id
    }
    if (contact.first_name)
      invitation.invitee_first_name = contact.first_name
    if (contact.last_name)
      invitation.invitee_last_name = contact.last_name
    if (contact.email)
      invitation.email = contact.email
    if (contact.phone_number)
      invitation.phone_number = contact.phone_number
    return invitation
  })
  const params = {
    access_token: user.access_token,
    invitations
  }
  Room.inviteContacts(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      delete AppStore.data.contacts_added
      delete AppStore.data.adding_contacts
      delete AppStore.data.show_contacts_modal
      AppStore.emitChange()
    }
  })
}