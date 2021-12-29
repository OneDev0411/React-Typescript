import { useAttributeDefs } from '../../hooks/use-attribute-defs'
import type { IAttribute } from '../../types'

export function useLabelOptions(attribute: IAttribute) {
  const { byId } = useAttributeDefs()

  if (!attribute || attribute.type === 'attribute_type') {
    return []
  }

  return byId[attribute.attribute_def].labels ?? []
}
