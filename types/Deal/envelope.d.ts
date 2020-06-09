declare type EnvelopeStatus =
  | 'None'
  | 'Created'
  | 'Delivered'
  | 'Sent'
  | 'Declined'
  | 'Voided'
  | 'Completed'

declare interface IDealEnvelopeRecipients extends IModel<'envelope_recipient'> {
  envelope: UUID
  envelope_recipient_type: 'CarbonCopy' | 'Signer'
  status: string
  order: number
  role: IDealRole
  signed_at: number | null
}

declare interface IDealEnvelopeDocument extends IModel<'envelope_document'> {
  document_id: number
  envelope: UUID
  file: UUID
  pdf: IFile
  submission: UUID | null
  submission_revision: UUID | null
  task: UUID
  title: string
}

declare interface IDealEnvelope extends IModel<'envelope'> {
  auto_notify: boolean
  created_by: UUID
  deal: UUID
  docusign_id: UUID
  recipients: IDealEnvelopeRecipients[]
  documents: IDealEnvelopeDocument[]
  status: EnvelopeStatus
  title: string
}

declare type ActionButtonId = number

declare type ActionButton = {
  label: string
  type: string
  condition?: function
  disabled: boolean
  tooltip: string
}
