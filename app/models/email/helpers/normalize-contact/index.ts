function hasEmail(contact: INormalizedContact): boolean {
  return !!contact && !!contact.email
}

function normalizeContact(
  contact: INormalizedContact
): IDenormalizedEmailRecipientInput {
  return {
    recipient_type: 'Email',
    email: contact.email as string,
    contact
  }
}

export function normalizeContactForEmailCompose(
  contact: INormalizedContact
): IDenormalizedEmailRecipientInput[] {
  if (!hasEmail(contact)) {
    return []
  }

  return [normalizeContact(contact)]
}

export function normalizeContactsForEmailCompose(
  contacts: INormalizedContact[]
): IDenormalizedEmailRecipientInput[] {
  return contacts.filter(hasEmail).map(normalizeContact)
}
