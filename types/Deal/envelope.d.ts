declare type EnvelopeStatus =
  | 'None'
  | 'Created'
  | 'Delivered'
  | 'Sent'
  | 'Declined'
  | 'Voided'
  | 'Completed'

declare interface IDealEnvelopeRecipients {
  id: UUID
  created_at: number
  envelope: UUID
  envelope_recipient_type: 'CarbonCopy' | 'Signer'
  order: number
  role: IDealRole
  signed_at: number | null
  type: 'envelope_recipient'
  updated_at: number
}

declare interface IDealEnvelopeDocument {
  id: UUID
  document_id: number
  envelope: UUID
  file: UUID
  pdf: IFile
  submission: UUID | null
  submission_revision: UUID | null
  task: UUID
  title: string
  type: 'envelope_document'
}

declare interface IDealEnvelope {
  id: UUID
  auto_notify: boolean
  created_at: number
  created_by: UUID
  deal: UUID
  docusign_id: UUID
  recipients: IDealEnvelopeRecipients[]
  documents: IDealEnvelopeDocument[]
  status: EnvelopeStatus
  title: string
}
