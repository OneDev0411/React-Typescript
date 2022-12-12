import ContactDetails from '@app/components/Pages/Dashboard/Contacts/Profile'
import InlineDialog from '@app/views/components/InlineDialog'

import {
  ContactDetailsModalActions,
  ContactDetailsModalActionsProps
} from './ContactDetailsModalActions'

interface Props extends ContactDetailsModalActionsProps {
  contactId: UUID
}

export function ContactDetailsModal({ contactId, ...otherProps }: Props) {
  return (
    <InlineDialog open>
      <ContactDetails
        id={contactId}
        RenderActions={<ContactDetailsModalActions {...otherProps} />}
      />
    </InlineDialog>
  )
}
