import { useAttributeDefs as useAttributeDefsQuery } from '@app/models/contacts/get-attribute-defs/use-attribute-defs'

export function useAttributeDefs() {
  const { normalized } = useAttributeDefsQuery()

  return normalized
}
