import { notUndefined } from 'utils/ts-utils'

/**
 * Determines if the recipient lists possibly resolve to more than one addresses
 * Here is the reference for this logic:
 * https://gitlab.com/rechat/web/issues/3460#note_228398341
 * @param lists
 */
export function hasMultipleRecipients(
  ...lists: (IDenormalizedEmailRecipientInput[] | null | undefined)[]
) {
  const recipients = lists
    .filter(notUndefined)
    .flat() as IDenormalizedEmailRecipientInput[]

  return (
    recipients.some(recipient => recipient.recipient_type !== 'Email') ||
    recipients.filter(recipient => recipient.recipient_type === 'Email')
      .length > 1
  )
}
