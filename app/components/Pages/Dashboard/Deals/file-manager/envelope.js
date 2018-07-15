import React from 'react'
import styled from 'styled-components'

const ESignature = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
`

export default class Envelope extends React.Component {
  getName(role) {
    if (role.user) {
      return role.user.display_name
    }

    return `${role.legal_prefix || ''} ${role.legal_first_name ||
      ''} ${role.legal_last_name || ''}`.trim()
  }

  getRecipientsNames(recipients) {
    if (!recipients) {
      return ''
    }

    return recipients
      .filter(r => r.status === 'Completed')
      .map(r => this.getName(r.role))
      .join(', ')
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
        if (recipientsNames) {
          signatureText = `Signed by ${recipientsNames}`
        } else {
          signatureText = 'Sent, No signatures captured'
        }

        break
      case 'Created':
        signatureText = 'Draft'
        break

      default:
        signatureText = envelope.status
    }

    return <ESignature>{signatureText}</ESignature>
  }
}
