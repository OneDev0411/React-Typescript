// note that this is different from IEmailRecipient
export interface EmailRecipient {
  email: string
  contact?: INormalizedContact
}

export type Recipient = EmailRecipient | IContactList | IContactTag
