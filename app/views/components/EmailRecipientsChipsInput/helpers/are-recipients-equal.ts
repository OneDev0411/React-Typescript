import { curry, isEqual } from 'lodash'

export const areRecipientsEqual = curry(
  (
    recipient1: IDenormalizedEmailRecipientInput,
    recipient2: IDenormalizedEmailRecipientInput
  ) => {
    if (recipient1.recipient_type !== recipient2.recipient_type) {
      return false
    }

    if (recipient1.recipient_type === 'Brand') {
      return (
        recipient1.brand.id ===
        (recipient2 as IDenormalizedEmailRecipientBrandInput).brand.id
      )
    }

    return isEqual(recipient1, recipient2)
  }
)
