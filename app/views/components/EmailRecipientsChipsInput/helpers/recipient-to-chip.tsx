import { ChipInputItem } from '../../ChipsInput/types'
import { validateRecipient } from './validate-recipient'
import { recipientToString } from './recipient-to-string'
import { getEmailAddressFromEmailRecipient } from './get-email-address-from-email-recipient'

export function recipientToChip(
  recipient: IDenormalizedEmailRecipientInput
): ChipInputItem {
  const hasError = !!validateRecipient(recipient)
  const label = recipientToString(recipient)

  if (recipient.recipient_type === 'Email') {
    const emailAddress = getEmailAddressFromEmailRecipient(recipient.email)

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

  return {
    label,
    hasError
  }
}
