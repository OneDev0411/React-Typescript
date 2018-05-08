export function getNotes(contact) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  let list = []

  contact.sub_contacts.forEach(subContact => {
    const { Notes } = subContact.sections

    if (Array.isArray(Notes) && Notes.length > 0) {
      list = [...list, ...Notes]
    }
  })

  return list.sort((a, b) => b.updated_at - a.updated_at)
}
