import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Dropdown, Button } from 'react-bootstrap'
import cn from 'classnames'
import WhoSigned from './who-signed'

class Envelope extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showDropDown: false
    }
  }

  getRecipientsNames(recipients) {
    const names = []

    recipients.forEach(recp => {
      names.push(recp.user.display_name)
    })

    return names.join(', ')
  }

  toggleShowDropDown(show) {
    this.setState({ showDropDown: show })
  }

  getFormUrl() {
    const { user, task, envelope } = this.props
  }

  openFormViewer() {
    const { deal, envelope, task } = this.props

    browserHistory.push(
      `/dashboard/deals/${deal.id}/form-viewer/${task.id}/envelope/${envelope.id}`
    )
  }

  render() {
    const { deal, task, envelope } = this.props
    const { showDropDown } = this.state
    const { recipients } = envelope
    const isVoided = envelope.status === 'Voided'
    const areSigned = recipients.filter(r => r.status === 'Completed')
    const notSigned = recipients.filter(r => r.status !== 'Completed')
    const recipientsNames = this.getRecipientsNames(recipients)

    return (
      <div
        className={cn('item eSign', {
          voided: isVoided
        })}
        key={`eSign_${envelope.id}`}
      >
        <div className="image">
          <img src="/static/images/deals/signature.svg" />
        </div>

        <div className="name">
          <span className="link" onClick={() => !isVoided && this.openFormViewer()}>
            Sent to {recipientsNames}
          </span>
        </div>

        <div className="actions">
          <Dropdown
            id="drp-esign-who-signed"
            className="deal-esgin-whosigned"
            pullRight
            open={showDropDown && !isVoided}
            onToggle={open => this.toggleShowDropDown(open)}
          >
            <Button
              bsRole="toggle"
              className="btn-deal deal-esgin-cta-btn"
              style={{ width: '100%' }}
            >
              {areSigned.length} of {recipients.length} Signed
            </Button>

            <WhoSigned
              onRequestClose={() => this.toggleShowDropDown(false)}
              deal={deal}
              envelope={envelope}
              areSigned={areSigned}
              notSigned={notSigned}
              bsRole="menu"
            />
          </Dropdown>
        </div>

        {isVoided && <span className="void-label">VOIDED</span>}
      </div>
    )
  }
}

export default connect(({ user }) => ({
  user
}))(Envelope)
