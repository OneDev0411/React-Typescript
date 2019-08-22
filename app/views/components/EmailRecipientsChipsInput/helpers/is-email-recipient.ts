export function isEmailRecipient(
  input: IDenormalizedEmailRecipientInput
): input is IDenormalizedEmailRecipientEmailInput {
  return input.recipient_type === 'Email'
}
