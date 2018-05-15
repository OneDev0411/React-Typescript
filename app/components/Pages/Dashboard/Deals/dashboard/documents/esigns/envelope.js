import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import cn from 'classnames'

class Envelope extends React.Component {
  constructor(props) {
    super(props)
  }

  getName(role) {
    if (role.user) {
      return role.user.display_name
    }

    return `${role.legal_prefix || ''} ${role.legal_first_name ||
      ''} ${role.legal_last_name || ''}`.trim()
  }

  getRecipientsNames(recipients = []) {
    const names = []

    recipients.forEach(recp => {
      names.push(this.getName(recp.role))
    })

    return names.join(', ')
  }

  openFormViewer() {
    const { deal, envelope, task } = this.props

    browserHistory.push(
      `/dashboard/deals/${deal.id}/form-viewer/${task.id}/envelope/${
        envelope.id
      }`
    )
  }

  render() {
    const { envelope } = this.props
    const { recipients = [] } = envelope
    const isVoided = envelope.status === 'Voided'
    const isDraft = envelope.status === 'Created'
    const isCompleted = envelope.status === 'Completed'
    const recipientsNames = this.getRecipientsNames(recipients)
    const totalRecipients = recipients ? recipients.length : 0
    const areSigned = recipients
      ? recipients.filter(r => r.status === 'Completed')
      : []

    return (
      <div
        className={cn('item eSign', {
          disabled: isVoided
        })}
        key={`eSign_${envelope.id}`}
      >
        <div className="image">
          <img src="/static/images/deals/signature.svg" alt="" />
        </div>

        <div
          className="name"
          onClick={() => !isVoided && this.openFormViewer()}
        >
          <span>{recipientsNames}</span>
          {isDraft && <p className="text-danger">Draft</p>}
          {isVoided && <p className="text-danger">Voided</p>}
          {!isDraft &&
            !isVoided && (
              <p
                className={cn({
                  'text-success': isCompleted,
                  'text-secondary': !isCompleted
                })}
              >
                {areSigned.length} of {totalRecipients} signed
              </p>
            )}
        </div>
      </div>
    )
  }
}

export default connect(({ deals, user }) => ({
  roles: deals.roles,
  user
}))(Envelope)
