import React from 'react'
import { Link } from 'react-router'

import { Container } from './styled'

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

    const extra = envelope.status === 'Created' ? ' (Draft)' : ''

    if (envelope.status === 'Voided') {
      return 'Void'
    }

    if (envelope.status === 'Declined') {
      return 'Declined'
    }

    const extra = envelope.status === 'Created' ? ' (Draft)' : ''

    const recipients = envelope.recipients.filter(
      recipient => recipient.envelope_recipient_type === 'Signer'
    )

    if (recipients.length === 0) {
      return 'No Signers'
    }

    const signedCount = recipients.filter(r => r.status === 'Completed').length

    return `${signedCount} of ${recipients.length} signed${extra}`
  }

  if (!envelope) {
    return null
  }

  return (
    <Container>
      <Link
        to={`/dashboard/deals/${deal.id}/view/${task.id}/envelope/${envelope.id}`}
      >
        {getTitle(envelope)}
      </Link>
    </Container>
  )
}
