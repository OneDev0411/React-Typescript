export function isContactTag(
  input: IDenormalizedEmailRecipientInput
): input is IDenormalizedEmailRecipientTagInput {
  return input.recipient_type === 'Tag'
}
