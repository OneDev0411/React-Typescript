import React, { Fragment } from 'react'
import { connect } from 'react-redux'

class Envelope extends React.Component {
  getName(role) {
    if (role.user) {
      return role.user.display_name
    }

    return `${role.legal_prefix || ''} ${role.legal_first_name ||
      ''} ${role.legal_last_name || ''}`.trim()
  }

  getRecipientsNames(recipients) {
    const names = []

    recipients &&
      recipients.forEach(recp => {
        names.push(this.getName(recp.role))
      })

    return names.join(', ')
  }

  render() {
    const { envelope } = this.props
    const { recipients = [] } = envelope
    const recipientsNames = this.getRecipientsNames(recipients)

    let signatureText

    switch (envelope.status) {
      case 'Completed':
        signatureText = `Signed by ${recipientsNames}`
        break
      case 'Sent':
        signatureText = 'Sent, not signed'
        break
      case 'Created':
        signatureText = 'Draft'
        break

      default:
        signatureText = envelope.status
    }

    return <Fragment>{signatureText}</Fragment>
  }
}

export default connect(({ deals, user }) => ({
  roles: deals.roles,
  user
}))(Envelope)
