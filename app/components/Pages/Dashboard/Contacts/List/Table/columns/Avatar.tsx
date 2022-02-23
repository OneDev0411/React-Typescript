import { Avatar } from 'components/Avatar'
import {
  getAttributeFromSummary,
  getContactNameInitials,
  getContactOnlineStatus
} from 'models/contacts/helpers'

interface Props {
  contact: INormalizedContact
}

function ContactAvatar({ contact }: Props) {
  const name = getAttributeFromSummary(contact, 'display_name')

  return (
    <Avatar
      size="small"
      alt={name}
      contact={contact}
      showStatus
      isOnline={getContactOnlineStatus(contact)}
    >
      {getContactNameInitials(contact)}
    </Avatar>
  )
}

export default ContactAvatar
