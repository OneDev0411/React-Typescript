import { useCallback } from 'react'

import { IAttribute } from '../types'

import { useAttributeDefs } from './use-attribute-defs'

export function useAttributeLabel() {
  const { byId } = useAttributeDefs()

  const getAttributeLabel = useCallback(
    (attribute: IAttribute) => {
      if (!attribute) {
        return
      }

      if (attribute.type === 'attribute_type') {
        return attribute.label
      }

      if (attribute.type === 'attribute_def') {
        return byId[attribute.attribute_def].label
      }

      return ''
    },
    [byId]
  )

  return getAttributeLabel
}
