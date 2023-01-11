import ContactDetails from '@app/components/Pages/Dashboard/Contacts/Profile'
import { noop } from '@app/utils/helpers'
import InlineDialog from '@app/views/components/InlineDialog'

import {
  ContactDetailsModalActions,
  ContactDetailsModalActionsProps
} from './ContactDetailsModalActions'

interface Props extends ContactDetailsModalActionsProps {
  contactId: UUID
  onOpen: (id: UUID) => void
  onUpdateContact?: (contact: INormalizedContact) => void
  onDeleteContact?: (id: UUID) => void
}

export function ContactDetailsModal({
  contactId,
  onOpen,
  onUpdateContact = noop,
  onDeleteContact = noop,
  ...otherProps
}: Props) {
  return (
    <InlineDialog open>
      <ContactDetails
        isModal
        onOpenContact={onOpen}
        onUpdateContact={onUpdateContact}
        onDeleteContact={onDeleteContact}
        onCloseContact={otherProps.onClose}
        id={contactId}
        RenderActions={<ContactDetailsModalActions {...otherProps} />}
      />
    </InlineDialog>
  )
}
