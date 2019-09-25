/**
 * Extracts email address from an email recipient in one of the following forms:
 *  - "Display Name <email address>"
 *  - "email address"
 */
export function getEmailAddressFromEmailRecipient(input: string): string {
  const [, emailInBrackets] = input.match(/.*<(.+)>/) || []

  return emailInBrackets || input
}
