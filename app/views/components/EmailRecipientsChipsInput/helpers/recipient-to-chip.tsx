import { ChipInputItem } from '../../ChipsInput/types'
import { validateRecipient } from './validate-recipient'
import { recipientToString } from './recipient-to-string'

export function recipientToChip(
  recipient: IDenormalizedEmailRecipientInput
): ChipInputItem {
  const hasError = !!validateRecipient(recipient)
  const label = recipientToString(recipient)

  if (recipient.recipient_type === 'Email') {
    return {
      label,
      hasError,
      /**
       * If for whatever logic, we are not showing the full email address,
       * show it as a tooltip.
       */
      tooltip: label.includes(recipient.email) ? undefined : recipient.email
    }
  }

  return {
    label,
    hasError
  }
}
