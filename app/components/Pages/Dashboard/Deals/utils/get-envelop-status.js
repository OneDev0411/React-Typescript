import { getLegalFullName } from './roles'

function getRecipientsNames(recipients) {
  if (!recipients) {
    return ''
  }

  return recipients
    .filter(r => r.status === 'Completed')
    .map(r => getLegalFullName(r.role))
    .join(', ')
}

export function getEnvelopeStatus(envelope) {
  const recipients = envelope.recipients || []
  const recipientsNames = getRecipientsNames(recipients)

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

  return signatureText
}
