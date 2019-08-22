// note that this is different from IEmailRecipient
export interface EmailRecipient {
  recipientType
  email: string
  contact?: INormalizedContact
}

export type Recipient = EmailRecipient | IContactList | IContactTag
