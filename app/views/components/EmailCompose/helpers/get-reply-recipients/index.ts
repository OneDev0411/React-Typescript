import { parseEmailRecipient } from '../../../EmailRecipientsChipsInput/helpers/parse-email-recipient'

/**
 * Given an email, returns to and cc recipient arrays for Reply action.
 * The logic is captured from Gmail
 */
export function getReplyRecipients(
  email: IEmailThreadEmail
): {
  to: IDenormalizedEmailRecipientEmailInput[]
  cc: IDenormalizedEmailRecipientEmailInput[]
} {
  if (email.in_bound) {
    return {
      to: [emailAddressToRecipient(email.from)],
      cc: []
    }
  }

  return {
    to: email.to.map(emailAddressToRecipient),
    cc: []
  }
}

/**
 * Given an email, returns to and cc recipient arrays for Reply All action.
 * The logic is captured from Gmail
 */
export function getReplyAllRecipients(
  email: IEmailThreadEmail,
  ownEmail: string
) {
  if (email.in_bound) {
    return {
      to: [emailAddressToRecipient(email.from)],
      cc: [...email.to, ...email.cc]
        .filter(
          recipient => parseEmailRecipient(recipient).emailAddress !== ownEmail
        )
        .map(emailAddressToRecipient)
    }
  }

  return {
    to: email.to.map(emailAddressToRecipient),
    cc: email.cc.map(emailAddressToRecipient)
  }
}

const emailAddressToRecipient: (
  email: string
) => IDenormalizedEmailRecipientEmailInput = email => ({
  recipient_type: 'Email',
  email
})
