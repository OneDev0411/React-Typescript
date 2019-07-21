import { OAuthProvider } from 'constants/contacts'

import {
  IAttributeDefsState,
  selectDefinitionByName
} from 'reducers/contacts/attributeDefs'

const provider2Origin: EnumMap<OAuthProvider, string> = {
  [OAuthProvider.Google]: 'Google',
  [OAuthProvider.Outlook]: 'Microsoft'
}
export function getOrganizeSyncedContactsList(
  attributeDefs: IAttributeDefsState,
  provider?: OAuthProvider
): Partial<IContactList> {
  const sourceDefinition = selectDefinitionByName(attributeDefs, 'source_type')

  const providers = provider ? [provider] : Object.values(OAuthProvider)

  if (sourceDefinition) {
    const list: Partial<IContactList> = {
      filters: providers.map(provider => ({
        attribute_def: sourceDefinition.id,
        invert: false,
        value: provider2Origin[provider]
      }))
    }

    if (providers.length > 1) {
      list.args = {
        filter_type: 'or'
      }
    }

    return list
  }

  return {}
}
