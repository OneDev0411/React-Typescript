export function normalizeContactForEmailCompose(
  contact: INormalizedContact
): IDenormalizedEmailRecipientInput[] {
  if (!contact || !contact.email) {
    return []
  }

  return [
    {
      recipient_type: 'Email',
      email: contact.email,
      contact
    }
  ]
}
