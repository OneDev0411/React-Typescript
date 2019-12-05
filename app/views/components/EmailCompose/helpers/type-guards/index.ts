export function isGoogleMessage(
  email: IEmailThreadMessage
): email is IGoogleMessage {
  return email.type === 'google_message'
}

export function isMicrosoftMessage(
  email: IEmailThreadMessage
): email is IMicrosoftMessage {
  return email.type === 'microsoft_message'
}
