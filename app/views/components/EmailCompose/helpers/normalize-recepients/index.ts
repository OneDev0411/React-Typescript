import { Recipient } from '../../../ContactsChipsInput/types'
import { isContactList } from '../../../ContactsChipsInput/helpers/is-contact-list'
import { isContactTag } from '../../../ContactsChipsInput/helpers/is-contact-tag'

export function normalizeRecipients(
  recipients: Recipient[] | undefined
): IEmailRecipientInput[] {
  return (
    (recipients &&
      recipients.map(recipient => {
        if (isContactTag(recipient)) {
          return {
            recipient_type: 'Tag',
            tag: recipient.text
          }
        }

        if (isContactList(recipient)) {
          return {
            recipient_type: 'List',
            list: recipient.id
          }
        }

        const result: IEmailRecipientEmailInput = {
          recipient_type: 'Email',
          email: recipient.email
        }

        if (recipient.contact) {
          result.contact = recipient.contact.id
        }

        return result
      })) ||
    []
  )
}
