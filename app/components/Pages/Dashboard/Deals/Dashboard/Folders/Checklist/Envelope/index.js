import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { getTaskEnvelopes } from '../../../../utils/get-task-envelopes'
import { getDocumentEnvelopes } from '../../../../utils/get-document-envelopes'

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
      .sort((a, b) => {
        if (a.status === 'Completed')
          return -1

        if (b.status === 'Completed')
          return 1

        return 0
      })

    if (envelopes.length === 0) {
      return null
    }

    return envelopes[0]
  }

  getTitle = envelope => {
    const signedCount = envelope.recipients.filter(
      r => r.status === 'Completed'
    ).length

    return `${signedCount} of ${envelope.recipients.length} signed`
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

function mapStateToProps({ deals }) {
  return {
    envelopes: deals.envelopes
  }
}

export default connect(mapStateToProps)(EnvelopeView)
