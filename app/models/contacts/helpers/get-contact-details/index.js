export function getContactDetails(contact) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  let list = []

  contact.sub_contacts.forEach(subContact => {
    const { Details } = subContact.sections

    if (Array.isArray(Details) && Details.length > 0) {
      list = [...list, ...Details]
    }
  })

  return list.sort(
    (a, b) => b.attribute_def.name - a.attribute_def.name && b.index - a.index
  )
}
