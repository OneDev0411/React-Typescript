export function getContactTags(contact, attribute_def, defaultTags) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  const tags = {}

  const add = tag => {
    if (!tags[tag.text]) {
      tags[tag.text] = tag
    }
  }

  contact.sub_contacts.forEach(subContact => {
    const { Tags } = subContact.sections

    if (Array.isArray(Tags) && Tags.length > 0) {
      Tags.forEach(tag =>
        add({
          ...tag,
          active: true
        })
      )
    }
  })

  // get default tags with current contact's tag
  if (defaultTags) {
    defaultTags.forEach(tag =>
      add({
        ...tag,
        attribute_def
      })
    )
  }

  return tags
}
