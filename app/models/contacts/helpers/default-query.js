export const defaultQuery = [
  'associations[]=contact.sub_contacts',
  'associations[]=contact_attribute.attribute_def',
  'associations[]=contact.summary',
  'associations[]=sub_contact.users'
].join('&')

export const defaultOptions = {
  'associations[]': 'contact.sub_contacts',
  'associations[]': 'contact_attribute.attribute_def',
  'associations[]': 'contact.summary',
  'associations[]': 'sub_contact.users'
}
