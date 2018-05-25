export function getContactStage(contact) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  let { Stage } = contact.sub_contacts[0].sections

  if (!Stage || Stage.length === 0) {
    return null
  }

  return Stage[Stage.length - 1]
}
