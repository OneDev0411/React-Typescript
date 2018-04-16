export function getNotes(contact, attributeDef) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  let list = []

  contact.sub_contacts.forEach(subContact => {
    const notes = subContact.attributes[attributeDef]

    if (Array.isArray(notes) && notes.length > 0) {
      list = [...list, ...notes]
    }
  })

  return list.sort((a, b) => b.updated_at - a.updated_at)
}
