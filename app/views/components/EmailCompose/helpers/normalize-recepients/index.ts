import { isContactList } from '../../../EmailRecipientsChipsInput/helpers/is-contact-list'
import { isContactTag } from '../../../EmailRecipientsChipsInput/helpers/is-contact-tag'

export function normalizeRecipients(
  recipients: IDenormalizedEmailRecipientInput[] | undefined
): IEmailRecipientInput[] {
  return (
    (recipients &&
      recipients.map(recipient => {
        if (isContactTag(recipient)) {
          return {
            recipient_type: 'Tag',
            tag: recipient.tag.text
          }
        }

        if (isContactList(recipient)) {
          return {
            recipient_type: 'List',
            list: recipient.list.id
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
