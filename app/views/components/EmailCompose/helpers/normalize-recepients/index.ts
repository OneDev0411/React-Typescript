export function normalizeRecipients(
  recipients: IDenormalizedEmailRecipientInput[] | undefined
): IEmailRecipientInput[] {
  return (
    (recipients &&
      recipients.map(recipient => {
        if (recipient.recipient_type === 'Tag') {
          return {
            recipient_type: 'Tag',
            tag: recipient.tag.text
          }
        }

        if (recipient.recipient_type === 'List') {
          return {
            recipient_type: 'List',
            list: recipient.list.id
          }
        }

        if (recipient.recipient_type === 'Email') {
          const result: IEmailRecipientEmailInput = {
            recipient_type: 'Email',
            email: recipient.email
          }

          if (recipient.contact) {
            result.contact = recipient.contact.id
          }

          return result
        }

        if (recipient.recipient_type === 'Brand') {
          return {
            recipient_type: 'Brand',
            brand: recipient.brand.id
          }
        }

        return recipient
      })) ||
    []
  )
}
