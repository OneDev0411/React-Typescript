import { useAttributeDefinition } from '../../hooks/use-attribute-definition'
import type { IAttribute } from '../../types'

export function useLabelOptions(attribute: Nullable<IAttribute>) {
  const getAttributeDefinitions = useAttributeDefinition()

  if (!attribute) {
    return []
  }

  const definition = getAttributeDefinitions(attribute)

  return definition?.labels ?? []
}
