function hasEmail(contact: INormalizedContact): boolean {
  return !!contact && !!contact.email
}

function normalizeContact(
  contact: INormalizedContact
): IDenormalizedEmailRecipientInput {
  return {
    recipient_type: 'Email',
    email: contact.email!,
    contact
  }
}

export function normalizeContactsForEmailCompose(
  contacts: INormalizedContact[]
): IDenormalizedEmailRecipientInput[] {
  return contacts.filter(hasEmail).map(normalizeContact)
}
