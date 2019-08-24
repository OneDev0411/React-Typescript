export function getDisplayNameForContactEmail(
  email: string,
  contact: IContact
) {
  if ((contact.emails || []).includes(email)) {
    return contact.display_name
  }

  if (contact.partner_email === email) {
    return contact.partner_name
  }

  return ''
}
