const associations = [
  'contact.attributes',
  'contact.summary',
  'contact.users',
  'contact_attribute.attribute_def'
]

export const defaultQuery = { associations }

export const updateContactQuery = {
  associations: [
    ...associations,
    'user.last_seen_by',
    'contact.user',
    'contact.created_by',
    'contact.updated_by'
  ]
}
