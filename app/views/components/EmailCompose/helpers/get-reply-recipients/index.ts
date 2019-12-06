import { parseEmailRecipient } from '../../../EmailRecipientsChipsInput/helpers/parse-email-recipient'
import { EmailThreadEmail } from '../../../EmailThread/types'

/**
 * Given an email, returns to and cc recipient arrays for Reply action.
 * The logic is captured from Gmail
 */
export function getReplyRecipients(
  email: EmailThreadEmail
): {
  to: IDenormalizedEmailRecipientEmailInput[]
  cc: IDenormalizedEmailRecipientEmailInput[]
} {
  if (email.inBound) {
    return {
      to: [
        // see this conversation for the reason we only use email address
        // and not "Name <email-address>" format:
        // https://rechathq.slack.com/archives/DJ1EYKXCM/p1575560233091300
        // It's DM between Abbas and Alireza though :D
        emailAddressToRecipient(parseEmailRecipient(email.from).emailAddress)
      ],
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
  email: EmailThreadEmail,
  /**
   * ownEmail: the email address of the owner of the inbox.
   * if an email is send from x to a,b and c, and we are using "Reply All"
   * action as b, x will be in `to` while a and c will be in `cc`.
   * In other words, when replying (all) an inbound email, all to and cc
   * recipients will be in cc, except for the owner which obviously doesn't
   * want to email themselves when replying.
   */
  ownEmail: string
) {
  if (email.inBound) {
    return {
      to: [
        emailAddressToRecipient(parseEmailRecipient(email.from).emailAddress)
      ],
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
