export function getContactDeals(contact) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  return contact.deals || []
}
