import { Recipient } from '../types'
import { ChipInputItem } from '../../ChipsInput/types'
import { validateRecipient } from './validate-recipient'
import { isContactList } from './is-contact-list'
import { isContactTag } from './is-contact-tag'
import { recipientToString } from './recipient-to-string'

export function recipientToChip(recipient: Recipient): ChipInputItem {
  const hasError = !!validateRecipient(recipient)

  const label = recipientToString(recipient)

  if (isContactList(recipient)) {
    return {
      label,
      hasError
    }
  }

  if (isContactTag(recipient)) {
    return {
      label,
      hasError
    }
  }

  return {
    label,
    hasError
  }
}
