import { recipientToString } from '../../../../EmailRecipientsChipsInput/helpers/recipient-to-string'

const LENGTH_LIMIT = 40

export function getNumShownRecipients(
  recipients: IDenormalizedEmailRecipientInput[]
): number {
  let totalLength = 0

  return Math.max(
    1,
    recipients.findIndex((recipient, index) => {
      const length = recipientToString(recipient).length

      if (
        index === recipients.length - 1 ||
        length + totalLength > LENGTH_LIMIT
      ) {
        return true
      }

      totalLength += length
    }) + 1
  )
}
