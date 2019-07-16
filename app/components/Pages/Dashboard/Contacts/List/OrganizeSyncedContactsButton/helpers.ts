import {
  IAttributeDefsState,
  selectDefinitionByName
} from 'reducers/contacts/attributeDefs'

export function getOrganizeSyncedContactsAttributeFilters(
  attributeDefs: IAttributeDefsState
): IContactAttributeFilter[] {
  const sourceDefinition = selectDefinitionByName(attributeDefs, 'source_type')

  const origin = 'Google'

  if (sourceDefinition) {
    return [
      {
        attribute_def: sourceDefinition.id,
        invert: false,
        value: origin
      }
    ]
  }

  return []
}
