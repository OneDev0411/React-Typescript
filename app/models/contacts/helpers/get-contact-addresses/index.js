export function getContactAddresses(contact) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  let addressesFields = []

  contact.sub_contacts.forEach(subContact => {
    const { Addresses } = subContact.sections

    if (Array.isArray(Addresses) && Addresses.length > 0) {
      addressesFields = [...addressesFields, ...Addresses]
    }
  })

  return addressesFields
}
