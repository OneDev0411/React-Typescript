import { useCallback } from 'react'

import { IAttribute } from '../types'

import { useAttributeDefs } from './use-attribute-defs'
import { useAttributeTypes } from './use-attribute-types'

export function useAttributeDefinition() {
  const { byId: attributeDefsById } = useAttributeDefs()
  const attributeTypesByName = useAttributeTypes()

  return useCallback(
    (attribute: IAttribute) => {
      if (attribute.type === 'attribute_type') {
        return attributeTypesByName[attribute.attributeTypeName]
      }

      return attributeDefsById[attribute.attributeDefId]
    },
    [attributeDefsById, attributeTypesByName]
  )
}
