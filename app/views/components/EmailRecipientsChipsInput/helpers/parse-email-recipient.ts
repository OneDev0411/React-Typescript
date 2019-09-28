/**
 * Extracts email address from an email recipient in one of the following forms:
 *  - "Display Name <email address>"
 *  - "email address"
 */
export function parseEmailRecipient(
  input: string
): { emailAddress: string; displayName: string } {
  const [, displayName = '', emailAddress = input] =
    input.match(/(.*)<(.+)>/) || []

  return {
    emailAddress: emailAddress.trim(),
    displayName: displayName.trim()
  }
}
