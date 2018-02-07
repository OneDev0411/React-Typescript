const aliases = {
  Title: 'Escrow Officer',
  Lender: 'Lending Agent'
}

export function roleName(role) {
  const name = aliases[role] || role

  return name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/Co\s/g, 'Co-')
}

export function normalizeContact(contact) {
  const newContact = contact

  delete newContact.id

  const {
    legal_prefix,
    legal_last_name,
    legal_middle_name,
    legal_first_name,
    title,
    last_name,
    middle_name,
    first_name,
    email,
    phone_number
  } = contact

  const firstName = first_name !== email && first_name !== phone_number && first_name
  const legalFirstName =
    legal_first_name !== email &&
    legal_first_name !== phone_number &&
    legal_first_name

  const fakeRole = {
    ...newContact,
    legal_prefix: legal_prefix || title,
    legal_first_name: legalFirstName || firstName,
    legal_middle_name: legal_middle_name || middle_name,
    legal_last_name: legal_last_name || last_name
  }

  return fakeRole
}
