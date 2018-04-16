export function getNotes(contact) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  let list = []

  contact.sub_contacts.forEach(subContact => {
    const notes = subContact.attributes.Notes

    if (Array.isArray(notes) && notes.length > 0) {
      list = [...list, ...notes]
    }
  })

  return list.sort((a, b) => a.updated_at - b.updated_at)
}
