export interface ISignatureRecipient extends IDealRole {
  order: number
  envelope_recipient_type: 'Signer' | 'CarbonCopy'
}

export interface FormValues {
  attachments: IDealFile[]
  recipients: ISignatureRecipient[]
  subject: string
  message: string
  auto_notify: boolean
}
