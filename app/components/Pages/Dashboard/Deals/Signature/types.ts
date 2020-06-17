export interface ISignatureRecipient extends IDealRole {
  order: number
  envelope_recipient_type: 'Signer' | 'CarbonCopy'
}
