import { parseEmailRecipient } from '../../../EmailRecipientsChipsInput/helpers/parse-email-recipient'

/**
 * Given an email thread, returns to and cc recipient arrays. The logic is
 * captured from Gmail
 * @param email
 * @param replyAll
 */
export function getReplyRecipients(
  email: IEmailThreadEmail,
  replyAll = false
): {
  to: IDenormalizedEmailRecipientEmailInput[]
  cc: IDenormalizedEmailRecipientEmailInput[]
} {
  const emailAddressToRecipient: (
    email: string
  ) => IDenormalizedEmailRecipientEmailInput = email => ({
    recipient_type: 'Email',
    email
  })

  if (email.in_bound) {
    return {
      to: [emailAddressToRecipient(email.from)],
      cc: replyAll
        ? [...email.to, ...email.cc]
            .filter(
              recipient =>
                parseEmailRecipient(recipient).emailAddress !==
                email.owner_email
            )
            .map(emailAddressToRecipient)
        : []
    }
  }

  return {
    to: email.to.map(emailAddressToRecipient),
    cc: replyAll ? email.cc.map(emailAddressToRecipient) : []
  }
}
