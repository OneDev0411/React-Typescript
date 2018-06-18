export function getContactDeals(contact) {
  if (!contact) {
    throw new Error('Contact object is required!')
  }

  if (!contact.sub_contacts) {
    return []
  }

  let allDeals = []

  contact.sub_contacts.forEach(subContact => {
    const { deals } = subContact

    if (Array.isArray(deals) && deals.length > 0) {
      allDeals = [...allDeals, ...deals]
    }
  })

  return allDeals
}
