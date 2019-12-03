export function isGoogleMessage(
  email: IEmailThreadEmail
): email is IGoogleMessage {
  return email.type === 'google_message'
}

export function isMicrosoftMessage(
  email: IEmailThreadEmail
): email is IMicrosoftMessage {
  return email.type === 'microsoft_message'
}
