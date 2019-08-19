import { Recipient } from '../../../ContactsChipsInput/types'
import {
  isContactList,
  isContactTag
} from '../../../ContactsChipsInput/helpers'

export function normalizeRecipients(
  recipients: Recipient[] | undefined
): IEmailRecipientInput[] {
  return (
    (recipients &&
      recipients.map(recipient => {
        if (isContactTag(recipient)) {
          return {
            tag: recipient.text
          }
        }

        if (isContactList(recipient)) {
          return {
            list: recipient.id
          }
        }

        const result: IEmailRecipientEmailInput = {
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
