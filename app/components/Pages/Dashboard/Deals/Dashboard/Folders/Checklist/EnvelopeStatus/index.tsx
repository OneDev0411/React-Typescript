import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'

import { selectDealEnvelopes } from 'reducers/deals/envelopes'

import { getTaskEnvelopes } from 'views/utils/deal-files/get-task-envelopes'
import { getDocumentEnvelopes } from 'views/utils/deal-files/get-document-envelopes'

import { IAppState } from 'reducers'

import { Container } from './styled'

interface Props {
  type: 'task' | 'document' | 'envelope'
  deal: IDeal
  task: IDealTask
  envelope?: IDealEnvelope
  document?: IFile
}

export function EnvelopeStatus({
  deal,
  task,
  document,
  envelope,
  type
}: Props) {
  const envelopes = useSelector<IAppState, IDealEnvelope[]>(({ deals }) =>
    selectDealEnvelopes(deal, deals.envelopes)
  )

  const getEnvelope = () => {
    let itemEnvelopes: IDealEnvelope[] = []

    if (type === 'envelope') {
      return envelope
    }

    if (type === 'task') {
      itemEnvelopes = getTaskEnvelopes(envelopes, task)
    }

    if (type === 'document') {
      itemEnvelopes = getDocumentEnvelopes(envelopes, document!)
    }

    itemEnvelopes = itemEnvelopes
      .filter(
        envelope => ['Voided', 'Declined'].includes(envelope.status) === false
      )
      .sort((a, b) => b.created_at - a.created_at)

    if (itemEnvelopes.length === 0) {
      return null
    }

    return itemEnvelopes[0]
  }

  const getTitle = (envelope: IDealEnvelope): string => {
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

  const envelopeItem = getEnvelope()

  if (!envelopeItem) {
    return null
  }

  return (
    <Container>
      <Link
        to={`/dashboard/deals/${deal.id}/view/${task.id}/envelope/${envelopeItem.id}`}
      >
        {getTitle(envelopeItem)}
      </Link>
    </Container>
  )
}
