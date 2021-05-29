interface Props {
  deal: IDeal
  task: IDealTask
  envelope: IDealEnvelope
}

export function EnvelopeStatus({ deal, task, envelope }: Props) {
  const getTitle = (envelope: IDealEnvelope): string => {
    if (envelope.status === 'Voided') {
      return 'Void'
    }

    if (envelope.status === 'Declined') {
      return 'Declined'
    }

    const recipients = (envelope.recipients || []).filter(
      recipient => recipient.envelope_recipient_type === 'Signer'
    )

    if (recipients.length === 0) {
      return 'No Signers'
    }

    const signedCount = recipients.filter(r => r.status === 'Completed').length

    const extra = envelope.status === 'Created' ? ' (Draft)' : ''

    return `${signedCount} of ${recipients.length} signed${extra}`
  }

  if (!envelope) {
    return null
  }

  return <>{getTitle(envelope)}</>
}
