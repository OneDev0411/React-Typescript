import { notUndefined } from 'utils/ts-utils'

export function getRecipientsFromRecipientsEntity(
  sendType: IEmailRecipient['send_type'],
  recipients: IEmailRecipient<'list' | 'contact'>[]
): IDenormalizedEmailRecipientInput[] {
  return recipients
    .filter(recipient => recipient.send_type === sendType)
    .map<IDenormalizedEmailRecipientInput | undefined>(recipient => {
      if (recipient.recipient_type === 'Tag') {
        return {
          recipient_type: 'Tag',
          tag: {
            type: 'crm_tag',
            text: recipient.tag
          } as IContactTag
        }
      }

      if (recipient.recipient_type === 'List') {
        return {
          recipient_type: 'List',
          list: recipient.list
        }
      }

      if (recipient.recipient_type === 'Email' && recipient.email) {
        return {
          recipient_type: 'Email',
          email: recipient.email,
          contact: recipient.contact
        }
      }
    })
    .filter(notUndefined)
}
