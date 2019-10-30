import { ChipInputItem } from '../../ChipsInput/types'
import { validateRecipient } from './validate-recipient'
import { recipientToString } from './recipient-to-string'
import { parseEmailRecipient } from './parse-email-recipient'

export function recipientToChip(
  recipient: IDenormalizedEmailRecipientInput
): ChipInputItem {
  const hasError = !!validateRecipient(recipient)
  const label = recipientToString(recipient)

  if (recipient.recipient_type === 'Email') {
    const { emailAddress } = parseEmailRecipient(recipient.email)

    return {
      label,
      hasError,
      /**
       * If for whatever logic, we are not showing the full email address,
       * show it as a tooltip.
       */
      tooltip: label.includes(emailAddress) ? undefined : emailAddress
    }
  }

  if (recipient.recipient_type === 'Agent') {
    return {
      label: recipient.agent.email,
      hasError
    }
  }
  
  return {
    label,
    hasError
  }
}
