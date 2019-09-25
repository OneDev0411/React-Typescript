import { getEmailAddressFromEmailRecipient } from '../../../EmailRecipientsChipsInput/helpers/get-email-address-from-email-recipient'

/**
 * Given an email thread, returns to and cc recipient arrays. The logic is
 * captured from Gmail
 * @param email
 * @param replayAll
 */
export function getReplyRecipients(
  email: IEmailThreadEmail,
  replayAll = false
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
      cc: replayAll
        ? [...email.to, ...email.cc]
            .filter(
              recipient =>
                getEmailAddressFromEmailRecipient(recipient) !==
                email.owner_email
            )
            .map(emailAddressToRecipient)
        : []
    }
  }

  return {
    to: email.to.map(emailAddressToRecipient),
    cc: replayAll ? email.cc.map(emailAddressToRecipient) : []
  }
}
