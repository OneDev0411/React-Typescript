function hasEmail(contact: IContact): boolean {
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
  contacts: IContact[]
): IDenormalizedEmailRecipientInput[] {
  return contacts.filter(hasEmail).map(normalizeContact)
}
