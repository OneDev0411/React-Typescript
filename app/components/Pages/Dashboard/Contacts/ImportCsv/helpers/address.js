import { selectDefinition } from '../../../../../../reducers/contacts/attributeDefs'

export function getAddressFields(attributes) {
  return attributes.bySection.Addresses.map(
    id => selectDefinition(attributes, id).name
  )
}

export function isAddressField(attributes, id) {
  const addressFields = getAddressFields(attributes)
  const definition = selectDefinition(attributes, id)

  return addressFields.includes(definition.name)
}
