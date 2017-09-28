import React from 'react'
import { connect } from 'react-redux'
import { Dropdown, Button } from 'react-bootstrap'
import _ from 'underscore'
import WhoSigned from './who-signed'
import FormModal from '../../../../../../Partials/Pdf/Modal'
import config from '../../../../../../../../config/public'

class Envelope extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showFormViewer: false
    }
  }

  getRecipientsNames(recipients) {
    const names = []
    recipients.forEach(recp => {
      names.push(recp.user.display_name)
    })

    return names.join(', ')
  }

  toggleFormViewer() {
    this.setState({
      showFormViewer: !this.state.showFormViewer
    })
  }

  getFormUrl() {
    const { user, task, envelope } = this.props
    if (!task.submission) {
      return null
    }

    // get document index
    const doc = _.find(envelope.documents, doc => doc.submission === task.submission.id)

    if (!doc){
      return null
    }

    return `${config.api_url}/envelopes/${envelope.id}/${doc.document_id}.pdf?access_token=${user.access_token}`
  }

  render() {
    const { envelope } = this.props
    const { showFormViewer } = this.state
    const { recipients } = envelope
    const areSigned = recipients.filter(r => r.status === 'Completed')
    const notSigned = recipients.filter(r => r.status !== 'Completed')
    const formUrl = this.getFormUrl()

    console.log(formUrl)

    return (
      <div
        className="item eSign"
        key={`eSign_${envelope.id}`}
      >
        <FormModal
          file={{
            type: 'pdf',
            name: envelope.title,
            src: formUrl
          }}
          isActive={showFormViewer}
          onCloseHandler={() => this.toggleFormViewer()}
        />

        <div className="image">
          <img src="/static/images/deals/signature.svg" />
        </div>

        <div className="name">
          Sent to { this.getRecipientsNames(recipients) }
        </div>

        <div className="actions">
          {
            formUrl &&
            <button
              className="btn-deal"
              onClick={() => this.toggleFormViewer()}
            >
              View
            </button>
          }

          <Dropdown
            id="drp-esign-who-signed"
            className="deal-esgin-whosigned"
            pullRight
          >
            <Button
              bsRole="toggle"
              className="btn-deal deal-esgin-cta-btn"
              style={{ width: '100%' }}
            >
              {areSigned.length} of {recipients.length} Signed
            </Button>

            <WhoSigned
              envelope={envelope}
              areSigned={areSigned}
              notSigned={notSigned}
              bsRole="menu"
            />
          </Dropdown>
        </div>
      </div>
    )
  }
}

export default connect(({ user }) => ({
  user
}))(Envelope)
