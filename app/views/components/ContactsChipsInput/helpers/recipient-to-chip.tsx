import React from 'react'

import { Recipient } from '../types'
import { ChipInputItem } from '../../ChipsInput/types'
import { validateRecipient } from './validate-recipient'
import { RecipientToString } from '../RecipientToString'
import { isContactList } from './is-contact-list'
import { isContactTag } from './is-contact-tag'

export function recipientToChip(recipient: Recipient): ChipInputItem {
  const hasError = !!validateRecipient(recipient)

  if (isContactList(recipient)) {
    return {
      label: recipient.name,
      hasError
    }
  }

  if (isContactTag(recipient)) {
    return {
      label: recipient.text,
      hasError
    }
  }

  return {
    label: <RecipientToString recipient={recipient} />,
    hasError
  }
}
