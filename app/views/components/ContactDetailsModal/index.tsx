import ContactDetails from '@app/components/Pages/Dashboard/Contacts/Profile'
import InlineDialog from '@app/views/components/InlineDialog'

import {
  ContactDetailsModalActions,
  ContactDetailsModalActionsProps
} from './ContactDetailsModalActions'

interface Props extends ContactDetailsModalActionsProps {
  contactId: UUID
  onOpen: (id: UUID) => void
}

export function ContactDetailsModal({
  contactId,
  onOpen,
  ...otherProps
}: Props) {
  return (
    <InlineDialog open>
      <ContactDetails
        isModal
        onOpenContact={onOpen}
        onCloseContact={otherProps.onClose}
        id={contactId}
        RenderActions={<ContactDetailsModalActions {...otherProps} />}
      />
    </InlineDialog>
  )
}
