import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Dropdown, Button } from 'react-bootstrap'
import cn from 'classnames'

class Envelope extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showDropDown: false
    }
  }

  getName(role) {
    if (role.user) {
      return role.user.display_name
    }

    return `${role.legal_prefix || ''} ${role.legal_first_name || ''} ${role.legal_last_name || ''}`
      .trim()
  }

  getRecipientsNames(recipients) {
    const names = []

    recipients.forEach(recp => {
      names.push(this.getName(recp.role))
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

        <div
          className="name"
          onClick={() => !isVoided && this.openFormViewer()}
        >
          <span>{recipientsNames}</span>
          <p>{areSigned.length} of {recipients.length} signed</p>
        </div>

        {
          isVoided &&
          <span className="void-label">VOIDED</span>
        }
      </div>
    )
  }
}

export default connect(({ deals, user }) => ({
  roles: deals.roles,
  user
}))(Envelope)
