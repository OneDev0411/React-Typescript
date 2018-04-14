export function getContactStage(contact) {
  if (!contact) {
    throw new Error('Contact is required!')
  }

  const { attributes } = contact.sub_contacts[0]

  if (!attributes) {
    return null
  }

  const { Stage } = attributes

  if (!Stage) {
    return null
  }

  return Stage[0]
}
