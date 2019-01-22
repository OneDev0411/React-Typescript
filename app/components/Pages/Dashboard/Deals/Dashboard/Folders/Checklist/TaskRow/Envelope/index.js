import React from 'react'
import { connect } from 'react-redux'

import OverlayDrawer from 'components/OverlayDrawer'

import { getTaskEnvelopes } from '../../../../../utils/get-task-envelopes'

import Envelope from '../../../../../components/Envelope'

import { Container } from './styled'

class EnvelopeView extends React.Component {
  state = {
    isDrawerOpen: false
  }

  handleToggleDrawer = () =>
    this.setState(state => ({
      isDrawerOpen: !state.isDrawerOpen
    }))

  geEnvelope = () => {
    const envelopes = getTaskEnvelopes(
      this.props.envelopes,
      this.props.task
    ).filter(
      envelope => ['Voided', 'Declined'].includes(envelope.status) === false
    )

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

  render() {
    const envelope = this.geEnvelope()

    if (!envelope) {
      return 'Not sent for signature'
    }

    return (
      <React.Fragment>
        <Container onClick={this.handleToggleDrawer}>
          {this.getTitle(envelope)}
        </Container>

        <OverlayDrawer
          isOpen={this.state.isDrawerOpen}
          onClose={this.handleToggleDrawer}
        >
          <OverlayDrawer.Header title={envelope.title} />

          <OverlayDrawer.Body>
            <Envelope
              deal={this.props.deal}
              envelope={envelope}
              containerStyle={{ marginTop: '0.5rem' }}
            />
          </OverlayDrawer.Body>
        </OverlayDrawer>
      </React.Fragment>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    envelopes: deals.envelopes
  }
}

export default connect(mapStateToProps)(EnvelopeView)
