import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { selectDealEnvelopes } from 'reducers/deals/envelopes'

import { getTaskEnvelopes } from 'views/utils/deal-files/get-task-envelopes'
import { getDocumentEnvelopes } from 'views/utils/deal-files/get-document-envelopes'

import { Container } from './styled'

class EnvelopeView extends React.Component {
  geEnvelope = () => {
    let envelopes = []

    if (this.props.type === 'task' && this.props.task) {
      envelopes = getTaskEnvelopes(this.props.envelopes, this.props.task)
    }

    if (this.props.type === 'document' && this.props.document) {
      envelopes = getDocumentEnvelopes(
        this.props.envelopes,
        this.props.document
      )
    }

    envelopes = envelopes
      .filter(
        envelope => ['Voided', 'Declined'].includes(envelope.status) === false
      )
      .sort((a, b) => b.created_at - a.created_at)

    if (envelopes.length === 0) {
      return null
    }

    return envelopes[0]
  }

  getTitle = envelope => {
    const recipients = envelope.recipients.filter(
      recipient => recipient.envelope_recipient_type === 'Signer'
    )

    if (recipients.length === 0) {
      return 'No Signers'
    }

    const signedCount = recipients.filter(r => r.status === 'Completed').length

    return `${signedCount} of ${recipients.length} signed`
  }

  getLink = id =>
    `/dashboard/deals/${this.props.deal.id}/view/${
      this.props.task.id
    }/envelope/${id}`

  render() {
    const envelope = this.geEnvelope()

    if (!envelope) {
      return false
    }

    return (
      <Container>
        <Link to={this.getLink(envelope.id)}>{this.getTitle(envelope)}</Link>
      </Container>
    )
  }
}

function mapStateToProps({ deals }, props) {
  return {
    envelopes: selectDealEnvelopes(props.deal, deals.envelopes)
  }
}

export default connect(mapStateToProps)(EnvelopeView)
