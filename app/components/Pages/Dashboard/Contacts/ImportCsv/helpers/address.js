import { selectDefinition } from '../../../../../../reducers/contacts/attributeDefs'

export const addressFields = [
  'street_name',
  'street_number',
  'street_prefix',
  'street_suffix',
  'unit_number',
  'city',
  'state',
  'country',
  'postal_code',
  'zip_code'
]

export function isAddressField(attributes, id) {
  const definition = selectDefinition(attributes, id)

  return addressFields.includes(definition.name)
}
