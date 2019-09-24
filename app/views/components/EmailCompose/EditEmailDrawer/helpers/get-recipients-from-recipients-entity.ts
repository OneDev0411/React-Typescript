export function getRecipientsFromRecipientsEntity(
  sendType: IEmailRecipient['send_type'],
  recipients: IEmailRecipient<'list' | 'contact' | 'brand'>[]
): IDenormalizedEmailRecipientInput[] {
  return recipients
    .filter(recipient => recipient.send_type === sendType)
    .map<IDenormalizedEmailRecipientInput>(recipient => {
      // With this switch case, if new type of recipients are added ever,
      // we get a ts error here and we need to fix it.
      switch (recipient.recipient_type) {
        case 'Tag':
          return {
            recipient_type: 'Tag',
            tag: {
              type: 'crm_tag',
              text: recipient.tag
            } as IContactTag
          }
        case 'List':
          return {
            recipient_type: 'List',
            list: recipient.list
          }
        case 'Email':
          return {
            recipient_type: 'Email',
            email: recipient.email!,
            contact: recipient.contact
          }
        case 'AllContacts':
          return {
            recipient_type: 'AllContacts'
          }
        case 'Brand':
          return {
            recipient_type: 'Brand',
            brand: recipient.brand
          }
      }
    })
}
