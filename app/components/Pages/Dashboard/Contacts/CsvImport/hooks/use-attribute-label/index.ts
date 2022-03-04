import { useCallback } from 'react'

import { MappedField } from '../../types'
import { useAttributeDefinition } from '../use-attribute-definition'

export function useAttributeLabel() {
  const getAttributeDefinition = useAttributeDefinition()

  return useCallback(
    (attribute: Nullable<MappedField>) => {
      if (!attribute) {
        return ''
      }

      const definition = getAttributeDefinition(attribute)

      if (!definition) {
        return ''
      }

      let label = definition.label

      if (attribute.isPartner) {
        label = `Spouse/Partner - ${definition.label}`
      }

      return (attribute.index ?? 0) > 0 ? `${label} ${attribute.index}` : label
    },
    [getAttributeDefinition]
  )
}
