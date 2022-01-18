import { useAttributeDefs as useAttributeDefsQuery } from '@app/models/contacts/get-attribute-defs/use-attribute-defs'

export function useAttributeDefs() {
  const { data } = useAttributeDefsQuery()

  if (!data) {
    return {
      list: [],
      byId: {},
      byName: {},
      bySection: {}
    }
  }

  return data
}
