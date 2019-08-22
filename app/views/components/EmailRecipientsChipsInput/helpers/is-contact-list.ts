export function isContactList(
  input: IDenormalizedEmailRecipientInput
): input is IDenormalizedEmailRecipientListInput {
  return input.recipient_type === 'List'
}
